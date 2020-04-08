#include <EnvironmentCalculations.h>
#include <BME280I2C.h>
#include <Wire.h>
#include "MHZ19.h" 
#include "PMS.h"
#include <iostream> 
#include <vector>
using namespace std;
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <NTPClient.h>

#define FIREBASE_HOST "urbanmonitor-d7a3b.firebaseio.com"
#define FIREBASE_AUTH "q5hxBWmLFFtWcgmd9ZipolAt3XNMguZtpKSFr4Zx"

#define WIFI_SSID_1 "Unicorn_Eats_a_Corn"
#define WIFI_PASSWORD_1 ""


#define VIBR_SAMPL_TIME 100

#define RX_PIN 27                                          
#define TX_PIN 26 
#define RX_PIN2 16                                          
#define TX_PIN2 17     
                                      
#define BAUDRATE 9600 
#define TIMING 5*60
#define SAMPL_STEPS  100
#define SAMPL_MSECS  100
int secondsCounter = 0;


MHZ19 myMHZ19;
HardwareSerial CO2serial(1); 
HardwareSerial PMSerial(2); 

PMS pms(PMSerial);
PMS::DATA data;

unsigned long getDataTimer = 0;
unsigned long sendDataTimer = 0;

BME280I2C bme; 
FirebaseData firebaseData;
FirebaseJson json;

float temperature, devpoint, humidity, pressure, vibrlvl;
int   ppmCO2, pm1_0, pm2_5, pm10, counter;
double  vibrsum;

vector<float> temperature_vector; 
vector<float> humidity_vector; 
vector<float> pressure_vector;

vector<float> vibr_vector; 
vector<int> pm1_0_vector;
vector<int> pm2_5_vector;
vector<int> pm10_vector;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
void setup()
{
    pinMode(4, OUTPUT);
    digitalWrite(4, HIGH);
    Serial.begin(9600);
      
    WiFi.begin(WIFI_SSID_1, WIFI_PASSWORD_1);
    
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    Firebase.reconnectWiFi(true);
    
    CO2serial.begin(BAUDRATE, SERIAL_8N1, RX_PIN, TX_PIN);
    PMSerial.begin (BAUDRATE, SERIAL_8N1, RX_PIN2, TX_PIN2);
    
    pms.passiveMode();    // Switch to passive mode
    

    Wire.begin();

    myMHZ19.begin(CO2serial);
    myMHZ19.autoCalibration(false);  
    
    while(!bme.begin())
    {
      Serial.println("Could not find BME280 sensor!");
      delay(1000);
    }

    delay(10);


//
//    Serial.println();
//    Serial.println();
    Serial.print("Waiting for WiFi... ");

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    
    timeClient.begin();
    timeClient.setTimeOffset(7200);
    while(!timeClient.update()) {
      timeClient.forceUpdate();
    }
    String formattedDate = timeClient.getFormattedDate();
    //Serial.println(formattedDate);
}

void getclimate(float &temperature, float &devpoint, float &humidity, float &pressure){
  
   float temp(NAN), hum(NAN), pres(NAN);

   BME280::TempUnit tempUnit(BME280::TempUnit_Celsius);
   BME280::PresUnit presUnit(BME280::PresUnit_hPa);

   bme.read(pres, temp, hum, tempUnit, presUnit);

   EnvironmentCalculations::AltitudeUnit envAltUnit  =  EnvironmentCalculations::AltitudeUnit_Meters;
   EnvironmentCalculations::TempUnit     envTempUnit =  EnvironmentCalculations::TempUnit_Celsius;
   
   humidity       = hum;
   temperature    = temp;
   pressure       = pres;
   devpoint = EnvironmentCalculations::DewPoint(temp, hum, envTempUnit);
}


void getCO2(int &ppmco2){
  ppmco2 = myMHZ19.getCO2();        
}

void getMP(int &pm1_0,int &pm2_5,int &pm10){
    pm1_0 = data.PM_AE_UG_1_0;
    pm2_5 = data.PM_AE_UG_2_5;
    pm10  = data.PM_AE_UG_10_0;
}

//void getVIBR(int &vibrlvl){
//  vibrlvl = analogRead(39);
//}


void loop()
{
  if (millis() - getDataTimer >= SAMPL_MSECS)
    {        
      vibrsum+=(float)analogRead(39);
      counter++;
      if(counter>SAMPL_STEPS){
        getCO2(ppmCO2);
        getclimate(temperature, devpoint, humidity, pressure);
        
        temperature_vector.push_back(temperature); 
        humidity_vector.push_back(humidity); 
        pressure_vector.push_back(pressure); 
        pm1_0_vector.push_back(pm1_0); 
        pm2_5_vector.push_back(pm2_5); 
        pm10_vector.push_back(pm10); 
        vibr_vector.push_back((float)vibrsum/(float)(SAMPL_STEPS));
        
        vibrsum = 0.0;

        
      }
      getDataTimer = millis();
    }

    if (millis() - sendDataTimer >= 1000)
    {        
      secondsCounter++;
      if(secondsCounter>TIMING){
         secondsCounter=0;
         Serial.println("Lets calc...");
         
         float tempAverage     = accumulate  (temperature_vector.begin(), temperature_vector.end(), 0.0)  /temperature_vector.size();
         float humAverage      = accumulate  (humidity_vector.begin(),    humidity_vector.end(), 0.0)     /humidity_vector.size();
         float pressAverage    = accumulate  (pressure_vector.begin(),    pressure_vector.end(), 0.0)     /pressure_vector.size();        
         float pm1_0_Average   = accumulate  (pm1_0_vector.begin(),       pm1_0_vector.end(), 0.0)        /pm1_0_vector.size();       
         float pm2_5_Average   = accumulate  (pm2_5_vector.begin(),       pm2_5_vector.end(), 0.0)        /pm2_5_vector.size();      
         float pm10_Average    = accumulate  (pm10_vector.begin(),        pm10_vector.end(), 0.0)         /pm10_vector.size();
         float vibrAverage     = accumulate  (vibr_vector.begin(),        vibr_vector.end(), 0.0)         /vibr_vector.size();

         
         vibr_vector.clear();
         temperature_vector.clear();
         humidity_vector.clear();
         pressure_vector.clear(); 
         pm1_0_vector.clear();
         pm2_5_vector.clear();  
         pm10_vector.clear();  

         EnvironmentCalculations::TempUnit     envTempUnit =  EnvironmentCalculations::TempUnit_Celsius;
   
         float dewpoint_Average = EnvironmentCalculations::DewPoint(tempAverage, humAverage, envTempUnit);

          Serial.println("Lets firebase...");
 
         json.clear()
             .add("temperature", tempAverage)
             .add("humidity", humAverage)
             .add("pressure", pressAverage)
             .add("PM_1_0", pm1_0_Average)
             .add("PM_2_5", pm2_5_Average)
             .add("PM_10_0", pm10_Average)
             .add("dewpoint", dewpoint_Average)
             .add("vibration", vibrAverage)
             .add("PPM_CO2", ppmCO2)
             .add("timestamp", timeClient.getFormattedDate());
//
         if(Firebase.pushJSON(firebaseData, "/dataframe", json)){
           Serial.println("Set Float data success");
         }else{
           Serial.println("Firebasefail");
         }
      }
      sendDataTimer = millis();
    }
  
  if (pms.read(data))
  {
    getMP(pm1_0, pm2_5, pm10);
    
  }
}
