#ifndef Marquise_h
#define Marquise_h

#if (ARDUINO >= 100)
#include "Arduino.h"
#else
#include "WProgram.h"
#endif

#include <map>
#include <vector>
#include <Adafruit_NeoPixel.h>

enum class Color {
  RED = 0xFF0000,
  ORANGE = 0xFF3300,
  AMBER = 0xDD3000,
  YELLOW = 0xFF6600,
  GREEN = 0x00FF00,
  MINT_GREEN = 0x25AF20,
  BLUE = 0x0000FF,
  BABY_BLUE = 0x0033AA,
  CYAN = 0x00BBBB,
  PURPLE = 0xAA00FF,
  PINK = 0x882222
};

struct Character {
  std::vector<int> data;
  int width;
};

struct Letter {
  Character character;
  int pos;
  uint32_t color;
};

class Marquise {
  public:
    Marquise(int led_count, int led_pin);
    Adafruit_NeoPixel neopixel() { return m_neopixel; }

    void init();
    void setBrightness(uint8_t brightness) { m_neopixel.setBrightness(brightness); }
    void show() { m_neopixel.show(); }
    void fill(uint32_t c = 0, uint16_t first = 0, uint16_t count = 0) { m_neopixel.fill(c, first, count); }
    void clear() { m_neopixel.clear(); }
    void draw_letter(std::vector<int>, int, uint32_t);
    void scroll_text(String text, int speed, uint32_t color);
    void scroll_text(String text, int speed, Color color);

  private:
    Adafruit_NeoPixel m_neopixel;
    std::map<char, Character> letters;
    uint32_t m_color { 0 };
};

#endif