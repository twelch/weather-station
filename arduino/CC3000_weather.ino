/*************************************************** 
  Written by Tim Welch
  Based on a sketch to use the CC3000 WiFi chip & Xively
  Written by Marco Schwartz for Open Home Automation
  With code adapted by T
 ****************************************************/

// Libraries
#include <Adafruit_CC3000.h>
#include <SPI.h>
#include "DHT.h"
#include <avr/wdt.h>

// Define CC3000 chip pins
#define ADAFRUIT_CC3000_IRQ   3
#define ADAFRUIT_CC3000_VBAT  5
#define ADAFRUIT_CC3000_CS    10

// DHT sensor
#define DHTPIN 7
#define DHTTYPE DHT22

// Create CC3000 instances
Adafruit_CC3000 cc3000 = Adafruit_CC3000(ADAFRUIT_CC3000_CS, ADAFRUIT_CC3000_IRQ, ADAFRUIT_CC3000_VBAT,
                                         SPI_CLOCK_DIV2); // you can change this clock speed
                                         
// DHT instance
DHT dht(DHTPIN, DHTTYPE);

// WLAN parameters
#define WLAN_SSID       "yourWiFiSSID"
#define WLAN_PASS       "yourWiFiPassword"

#define WLAN_SECURITY   WLAN_SEC_WPA2

// Xively parameters
/*#define API_key  "yourAPIKey"
#define feedID  "yourFeedID"
*/

// ThingSpeak Settings
char thingSpeakAddress[] = "api.thingspeak.com";
//String writeAPIKey = "yourThingSpeakKey";

int buffer_size = 20;

uint32_t ip;

void setup(void)
{
  // Initialize
  Serial.begin(115200);
  
  Serial.println(F("Initializing WiFi chip..."));
  if (!cc3000.begin())
  {
    Serial.println(F("Couldn't begin()! Check your wiring?"));
    while(1);
  }
  
  // Connect to WiFi network
  Serial.print(F("Connecting to WiFi network ..."));
  cc3000.connectToAP(WLAN_SSID, WLAN_PASS, WLAN_SECURITY);
  Serial.println(F("done!"));
  
  // Wait for DHCP to complete
  Serial.println(F("Request DHCP"));
  while (!cc3000.checkDHCP())
  {
    delay(100);
  }
 
}

void loop(void)
{
  // Start watchdog 
  wdt_enable(WDTO_8S); 
  
  // Get IP
  uint32_t ip = 0;
  Serial.print(F("api.thingspea.com -> "));
  while  (ip  ==  0)  {
    if  (!  cc3000.getHostByName(thingSpeakAddress, &ip))  {
      Serial.println(F("Couldn't resolve!"));
      while(1){}
    }
    delay(500);
  }  
  cc3000.printIPdotsRev(ip);
  Serial.println(F(""));
  
  // Get data & transform to integers
  float h = dht.readHumidity();
  float t = dht.readTemperature(true);
  
  int temperature = (int) t;
  int humidity = (int) h;

  // Prepare JSON for Xively & get length
  int length = 0;

  // JSON data
  /*
  String data = "";
  data = data + "\n" + "{\"version\":\"1.0.0\",\"datastreams\" : [ "
  + "{\"id\" : \"Temperature\",\"current_value\" : \"" + String(temperature) + "\"},"
  + "{\"id\" : \"Humidity\",\"current_value\" : \"" + String(humidity) + "\"}]}";
  */
  
  String data = "";
  data = "field1=" + String(temperature) + "&field2=" + String(humidity);
  
  Serial.println(data);

  // Get length
  length = data.length();
 
  // Reset watchdog
  wdt_reset();
  
  // Check connection to WiFi
  Serial.print(F("Checking WiFi connection ..."));
  if(!cc3000.checkConnected()){while(1){}}
  Serial.println(F("done."));
  wdt_reset();
  
  // Ping Xively server
   Serial.print(F("Pinging Thingspeak server ..."));
  if(!cc3000.ping(ip, 2)){while(1){}}
  Serial.println(F("done."));
  wdt_reset();
  
  // Send request
  Adafruit_CC3000_Client client = cc3000.connectTCP(ip, 80);
  if (client.connected()) {
    Serial.println(F("Connected to Thingspeak server."));
    
    // Send headers
    /*
    Serial.print(F("Sending headers "));
    client.fastrprint(F("PUT /v2/feeds/"));
    client.fastrprint(feedID);
    client.fastrprintln(F(".json HTTP/1.0"));
    Serial.print(F("."));
    client.fastrprintln(F("Host: api.xively.com"));
    Serial.print(F("."));
    client.fastrprint(F("X-ApiKey: "));
    client.fastrprintln(API_key);
    Serial.print(F("."));
    client.fastrprint(F("Content-Length: "));
    client.println(length);
    Serial.print(F("."));
    client.fastrprint(F("Connection: close"));
    Serial.println(F(" done."));
    */

    Serial.print(F("Sending headers "));
    client.print("POST /update HTTP/1.1\n");
    client.print("Host: api.thingspeak.com\n");
    client.print("Connection: close\n");
    client.print("X-THINGSPEAKAPIKEY: "+writeAPIKey+"\n");
    client.print("Content-Type: application/x-www-form-urlencoded\n");
    client.print("Content-Length: ");
    client.print(data.length());
    client.print("\n\n");
    client.print(data);    
    Serial.println(F(" done."));
    
    // Reset watchdog
    wdt_reset();
    
  } else {
    Serial.println(F("Connection failed"));    
    return;
  }
  
  // Reset watchdog
  wdt_reset();
  
  Serial.println(F("Reading answer ..."));
  while (client.connected()) {
    while (client.available()) {
      char c = client.read();
      Serial.print(c);
    }
  }
  
  // Reset watchdog
  wdt_reset();
   
  // Close connection and disconnect
  client.close();
  Serial.println(F("Closing connection"));
  
  // Reset watchdog & disable
  wdt_reset();
  wdt_disable();
  
  // Wait 20 seconds until next update
  Serial.println(F("Waiting 20 seconds"));
  wait();
  
}

// Send data chunk by chunk
void sendData(Adafruit_CC3000_Client& client, String input, int chunkSize) {
  
  // Get String length
  int length = input.length();
  int max_iteration = (int)(length/chunkSize);
  
  for (int i = 0; i < length; i++) {
    client.print(input.substring(i*chunkSize, (i+1)*chunkSize));
    wdt_reset();
  }  
}

// Wait for a given time using the watchdog
void wait() {
  int total_delay = 100000;
  
  Serial.print("total delay ");
  Serial.print(total_delay);
  int number_steps = (int)(total_delay/5000);
  Serial.print("number of steps ");
  Serial.print(number_steps);
  wdt_enable(WDTO_8S);
  for (int i = 0; i < number_steps; i++){
    Serial.println(F("delay..."));
    delay(5000);
    wdt_reset();
  }
  wdt_disable();
}
