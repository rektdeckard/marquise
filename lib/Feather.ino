// A NeoPixel marquis display program

#include <Marquise.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h> 
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <vector>
#include <Adafruit_NeoPixel.h>

#define _DEBUG_

// Network Configuration
#ifndef STASSID
#define STASSID "pics or it never happened"
#define STAPSK  "Ginandtonic"
//#define STASSID "PixelPoint"
#endif

//#define ADDRESS "api.jsonbin.io"
#define ADDRESS "jsonbin.org"
#define PORT 443
//const char fingerprint[] PROGMEM = "04 e9 58 6a 51 6c 4f 66 e6 00 1d c3 76 06 95 ed 2c 2a 8a b4";
const char fingerprint[] PROGMEM = "60 00 f3 82 d9 e7 db e3 1c f5 9a b6 d8 ff 0b 38 05 56 54 27";

// Microcontroler LED
#define LED_PIN    4

// NeoPixel Pixel Count
#define LED_COUNT 32

struct Message {
  String text;
  uint32_t color;
  uint8_t speed;
};

std::vector<Message> queue;
bool screenOn = true;
bool isOfflineMode = false;
long lastFetch = 0;

// Initialization
Marquise mq(LED_COUNT, LED_PIN);
HTTPClient http;

void setup() {
#ifdef _DEBUG_
  Serial.begin(115200);
  delay(500);
#endif

  mq.init();
  connect();
  fetch();
}

wl_status_t connect() {
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(STASSID);

  WiFi.mode(WIFI_OFF);        //Prevents reconnection issue (taking too long to connect)
  delay(1000);
  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);

  wl_status_t status;
  while ((status = WiFi.status()) != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  WiFi.setAutoReconnect(true);
  Serial.println("\n");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  WiFi.printDiag(Serial);

  return status;
}

void fetch() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("Making HTTP request");

    WiFiClientSecure https;
    https.setFingerprint(fingerprint);
    https.setTimeout(10000);
    delay(1000);

    Serial.println("HTTPS Connecting");
    int r = 0; //retry counter
    while((!https.connect(ADDRESS, PORT)) && (r < 30)){
        delay(100);
        Serial.print(".");
        r++;
    }
    if(r==30) {
      Serial.println("Connection failed");
      return;
    }
    
    String URL = "/rektdeckard/marquise";
    Serial.println("Connected to web");
    Serial.print("Requesting URL: ");
    Serial.println(URL);

    https.println("GET " + URL + " HTTP/1.1") +
    https.print("Host: ");
    https.println(ADDRESS);
    https.println("User-Agent: arduino/1.0");
    https.println("Content-Type: application/json");
    https.println("authorization: token c5dae7e7-9bed-4859-a8a7-8a13d8746339");
//    https.println("secret-key: $2b$10$AOXx.uD.2vMLIWBhNRyF6.qDasREvbbmaKmPVNtaPgkT/0pF7S52q");
    https.print("Connection: close\r\n\r\n");
 
    Serial.println("Request sent");
  
    while (https.connected()) {
      String line = https.readStringUntil('\n');
      if (line == "\r") {
        Serial.println("headers received");
        break;
      }
    }
   
    Serial.println("Reply was:");
    Serial.println("==========");
    String line;
    while(https.available()){        
      line += https.readStringUntil('\n');  //Read Line by Line
//      Serial.println(line); //Print response
    }
    Serial.println("==========");
    Serial.println("Closing connection");

    lastFetch = millis();
      
    DynamicJsonDocument doc(1024);
    DeserializationError err = deserializeJson(doc, line);
//    Serial.println(err.c_str());
//    JsonObject response = doc["record"].as<JsonObject>();
    JsonObject response = doc.as<JsonObject>();
    
    if (response.size()) {
      if (!(screenOn = response["on"].as<bool>())) return;
      isOfflineMode = response["isOfflineMode"].as<bool>();
      if (uint8_t bri = response["brightness"].as<uint8_t>()) {
//        Serial.println(bri);
        mq.setBrightness(bri);
      }
      
      queue.clear();
      JsonArray messages = response["messages"].as<JsonArray>();
//      Serial.print("Messages: ");
//      Serial.println(messages.size());
      for (JsonVariant v : messages) {
        JsonObject message = v.as<JsonObject>();
//        Serial.print("  ");
//        Serial.println(message["text"].as<char*>());
//        Serial.print("  ");
//        Serial.println(message["color"].as<int>());
        queue.push_back({ message["text"].as<String>(), message["color"].as<uint32_t>(), message["speed"].as<uint8_t>() });
      }
    } else {
      Serial.println("No messages found");
    }

  } else {
    Serial.println();
    Serial.println("WiFi disconnected");
    Serial.println(WiFi.status());
    connect();
  }
}

void showFlag() {
  mq.fill(Color::BLUE, 0, 3);
  mq.fill(Color::BLUE, 8, 3);
  mq.fill(Color::RED, 3, 5);
  mq.fill(0x666666, 11, 5);
  mq.fill(Color::RED, 16, 8);
  mq.fill(0x666666, 24, 8);
  mq.show();
  delay(1000);
  mq.fill(0x666666, 3, 5);
  mq.fill(Color::RED, 11, 5);
  mq.fill(0x666666, 16, 8);
  mq.fill(Color::RED, 24, 8);
  mq.show();
  delay(1000);
  mq.fill(Color::RED, 3, 5);
  mq.fill(0x666666, 11, 5);
  mq.fill(Color::RED, 16, 8);
  mq.fill(0x666666, 24, 8);
  mq.show();
  delay(1000);
  mq.fill(0x666666, 3, 5);
  mq.fill(Color::RED, 11, 5);
  mq.fill(0x666666, 16, 8);
  mq.fill(Color::RED, 24, 8);
  mq.show();
  delay(1000);
}

void showInvertedFlag() {
  mq.fill(Color::BLUE, 29, 3);
  mq.fill(Color::BLUE, 21, 3);
  mq.fill(Color::RED, 0, 8);
  mq.fill(0x666666, 8, 8);
  mq.fill(Color::RED, 16, 5);
  mq.fill(0x666666, 24, 5);
  mq.show();
  delay(1000);
  mq.fill(0x666666, 0, 8);
  mq.fill(Color::RED, 8, 8);
  mq.fill(0x666666, 16, 5);
  mq.fill(Color::RED, 24, 5);
  mq.show();
  delay(1000);
  mq.fill(Color::RED, 0, 8);
  mq.fill(0x666666, 8, 8);
  mq.fill(Color::RED, 16, 5);
  mq.fill(0x666666, 24, 5);
  mq.show();
  delay(1000);
  mq.fill(0x666666, 0, 8);
  mq.fill(Color::RED, 8, 8);
  mq.fill(0x666666, 16, 5);
  mq.fill(Color::RED, 24, 5);
  mq.show();
  delay(1000);
}

void loop() {
  if (!isOfflineMode) {
    if(millis() - lastFetch > 60000) {
      fetch();
    }
    
    if (!screenOn) {
      mq.clear();
      mq.show();
      delay(60000);
      fetch();
      return;
    }
  }
  
  if (queue.size()) {
    for (size_t i = 0; i < queue.size(); i++) {
      Message msg = queue[i];
      mq.scroll_text(msg.text, msg.speed, msg.color);
      mq.clear();
      mq.show();
      delay(1000);
    }  
//    showInvertedFlag();
//    showInvertedFlag();
  } else {
    mq.scroll_text("ON AIR", 2, Color::RED);
    mq.clear();
    mq.show();
    delay(1000);
  }
}