#include "Marquise.h"
#include <Adafruit_NeoPixel.h>
#include <map>
#include <vector>

// #define _DEBUG_

Marquise::Marquise(int led_count, int led_pin) : m_neopixel(led_count, led_pin, NEO_GRB + NEO_KHZ800)
{
  letters.insert({'A', {{1, 2, 8, 11, 16, 17, 18, 19, 24, 27}, 4}});
  letters.insert({'B', {{0, 1, 2, 8, 9, 10, 11, 16, 19, 24, 25, 26}, 4}});
  letters.insert({'C', {{1, 2, 3, 8, 16, 25, 26, 27}, 4}});
  letters.insert({'D', {{0, 1, 2, 8, 11, 16, 19, 24, 25, 26}, 4}});
  letters.insert({'E', {{0, 1, 2, 3, 8, 16, 17, 18, 24, 25, 26, 27}, 4}});
  letters.insert({'F', {{0, 1, 2, 3, 8, 16, 17, 24}, 4}});
  letters.insert({'G', {{1, 2, 3, 8, 16, 18, 19, 25, 26, 27}, 4}});
  letters.insert({'H', {{0, 3, 8, 11, 16, 17, 18, 19, 24, 27}, 4}});
  letters.insert({'I', {{0, 1, 2, 9, 17, 24, 25, 26}, 3}});
  letters.insert({'J', {{1, 2, 3, 11, 16, 19, 25, 26}, 4}});
  letters.insert({'K', {{0, 3, 8, 10, 16, 17, 18, 19, 24, 27}, 4}});
  letters.insert({'L', {{0, 8, 16, 24, 25, 26}, 3}});
  letters.insert({'M', {{0, 1, 3, 4, 8, 10, 12, 16, 20, 24, 28}, 5}});
  letters.insert({'N', {{0, 3, 8, 9, 11, 16, 18, 19, 24, 27}, 4}});
  letters.insert({'O', {{1, 2, 8, 11, 16, 19, 25, 26}, 4}});
  letters.insert({'P', {{0, 1, 2, 8, 11, 16, 17, 18, 24}, 4}});
  letters.insert({'Q', {{1, 2, 8, 11, 16, 18, 19, 25, 26, 27}, 4}});
  letters.insert({'R', {{0, 1, 2, 8, 11, 16, 17, 18, 24, 27}, 4}});
  letters.insert({'S', {{1, 2, 3, 8, 9, 18, 19, 24, 25, 26}, 4}});
  letters.insert({'T', {{0, 1, 2, 9, 17, 25}, 3}});
  letters.insert({'U', {{0, 3, 8, 11, 16, 19, 25, 26}, 4}});
  letters.insert({'V', {{0, 3, 8, 11, 16, 18, 24, 25}, 4}});
  letters.insert({'W', {{0, 4, 8, 12, 16, 18, 20, 24, 25, 27, 28}, 5}});
  letters.insert({'X', {{0, 3, 8, 11, 17, 18, 24, 27}, 4}});
  letters.insert({'Y', {{0, 2, 8, 10, 17, 25}, 3}});
  letters.insert({'Z', {{0, 1, 2, 3, 10, 17, 24, 25, 26, 27}, 4}});
  letters.insert({'a', {{9, 16, 18, 25, 26}, 3}});
  letters.insert({'b', {{0, 8, 9, 16, 18, 24, 25}, 3}});
  letters.insert({'c', {{9, 10, 16, 25, 26}, 3}});
  letters.insert({'d', {{2, 9, 10, 16, 18, 25, 26}, 3}});
  letters.insert({'e', {{1, 8, 9, 10, 16, 25}, 3}});
  letters.insert({'f', {{1, 8, 16, 17, 24}, 2}});
  letters.insert({'g', {{0, 1, 8, 9, 10, 18, 25}, 3}});
  letters.insert({'h', {{0, 8, 16, 17, 18, 24, 26}, 3}});
  letters.insert({'i', {{0, 16, 24}, 1}});
  letters.insert({'j', {{8, 9, 10, 18, 24, 25}, 3}});
  letters.insert({'k', {{0, 8, 10, 16, 17, 24, 26}, 3}});
  letters.insert({'l', {{0, 8, 16, 25}, 2}});
  letters.insert({'m', {{8, 9, 11, 16, 18, 20, 24, 28}, 5}});
  letters.insert({'n', {{8, 9, 16, 18, 24, 26}, 3}});
  letters.insert({'o', {{9, 16, 18, 25}, 3}});
  letters.insert({'p', {{0, 1, 8, 10, 16, 17, 24}, 3}});
  letters.insert({'q', {{1, 2, 8, 10, 17, 18, 26}, 3}});
  letters.insert({'r', {{8, 9, 16, 24}, 2}});
  letters.insert({'s', {{9, 10, 17, 24, 25}, 3}});
  letters.insert({'t', {{1, 8, 9, 10, 17, 25}, 3}});
  letters.insert({'u', {{8, 10, 16, 18, 24, 25, 26}, 3}});
  letters.insert({'v', {{8, 10, 16, 18, 25}, 3}});
  letters.insert({'w', {{8, 12, 16, 18, 20, 25, 27}, 5}});
  letters.insert({'x', {{8, 10, 17, 24, 26}, 3}});
  letters.insert({'y', {{8, 10, 17, 24}, 3}});
  letters.insert({'z', {{8, 9, 17, 25, 26}, 3}});
  letters.insert({' ', {{}, 1}});
  letters.insert({'1', {{1, 8, 9, 17, 25}, 2}});
  letters.insert({'2', {{0, 1, 2, 10, 11, 16, 17, 24, 25, 26, 27}, 4}});
  letters.insert({'3', {{0, 1, 2, 3, 10, 19, 24, 25, 26}, 4}});
  letters.insert({'4', {{0, 8, 10, 16, 17, 18, 19, 26}, 4}});
  letters.insert({'5', {{0, 1, 2, 3, 8, 9, 18, 19, 24, 25, 26}, 4}});
  letters.insert({'6', {{1, 2, 8, 16, 17, 18, 19, 25, 26}, 4}});
  letters.insert({'7', {{0, 1, 2, 3, 11, 18, 25}, 4}});
  letters.insert({'8', {{1, 2, 8, 9, 10, 11, 16, 19, 24, 25, 26, 27}, 4}});
  letters.insert({'9', {{1, 2, 8, 9, 10, 11, 19, 25, 26}, 4}});
  letters.insert({'0', {{1, 2, 8, 10, 11, 16, 17, 19, 25, 26}, 4}});
  letters.insert({'.', {{24}, 1}});
  letters.insert({',', {{17, 24}, 2}});
  letters.insert({':', {{9, 25}, 2}});
  letters.insert({';', {{1, 17, 24}, 2}});
  letters.insert({'?', {{0, 1, 2, 3, 10, 11, 26}, 4}});
  letters.insert({'!', {{0, 8, 24}, 1}});
  letters.insert({'@', {{1, 2, 3, 8, 10, 11, 16, 25, 26, 27}, 4}});
  letters.insert({'#', {{1, 2, 8, 9, 10, 11, 16, 17, 18, 19, 25, 26}, 4}});
  letters.insert({'%', {{0, 3, 10, 17, 24, 27}, 4}});
  letters.insert({'^', {{8, 1, 10}, 3}});
  letters.insert({'&', {{1, 2, 8, 9, 10, 11, 16, 19, 24, 25, 26, 27, 28}, 5}});
  letters.insert({'*', {{0, 2, 9, 16, 18}, 3}});
  letters.insert({'(', {{1, 8, 16, 25}, 2}});
  letters.insert({')', {{0, 9, 17, 24}, 2}});
  letters.insert({'[', {{0, 1, 8, 16, 24, 25}, 2}});
  letters.insert({']', {{0, 1, 9, 17, 24, 25}, 2}});
  letters.insert({'{', {{1, 2, 8, 17, 25, 26}, 3}});
  letters.insert({'}', {{0, 1, 10, 17, 24, 25}, 3}});
  letters.insert({'-', {{16, 17, 18}, 3}});
  letters.insert({'+', {{9, 16, 17, 18, 25}, 3}});
  letters.insert({'_', {{24, 25, 26, 27}, 4}});
  letters.insert({'=', {{8, 9, 10, 24, 25, 26}, 3}});
  letters.insert({'|', {{1, 9, 17, 25}, 3}});
  letters.insert({'\\', {{0, 9, 18, 27}, 4}});
  letters.insert({'/', {{3, 10, 17, 24}, 4}});
  letters.insert({'"', {{0, 2, 8, 10}, 3}});
  letters.insert({'\'', {{0, 8}, 1}});
  letters.insert({'~', {{9, 11, 16, 18}, 4}});
  letters.insert({'`', {{0, 9}, 2}});
  letters.insert({'°', {{0}, 1}});
  letters.insert({'<', {{9, 16, 25}, 3}});
  letters.insert({'>', {{8, 17, 24}, 3}});
}

void Marquise::init()
{
  m_neopixel.begin();
  m_neopixel.show();
  m_neopixel.setBrightness(25);
}

void Marquise::draw_letter(std::vector<int> letter, int pos, uint32_t color)
{
  // Draw letter offset horizontally by <pos> on the FeatherWing
  for (int i = 0; i < letter.size(); i++) {
    int p = letter.at(i);
    if ((p / 8) == (p + pos) / 8) {
      m_neopixel.setPixelColor(p + pos, color);
    }
  }
}

void Marquise::scroll_text(String s, int speed, Color color)
{
  scroll_text(s, speed, (uint32_t)color);
}

void Marquise::scroll_text(String s, int speed, uint32_t color)
{
  //  Do the scrolling  
  //  Pop letters off the string and move them across the screen till they're
  //  off left side.

  std::vector<char> text;
  std::vector<Letter> screen;

  for (int i = 0; i < s.length(); i++) {
    text.push_back(s[i]);
  }

  while (text.size() || screen.size()) {
#ifdef _DEBUG_
    Serial.print("text: ");
    Serial.println(text.size());
    Serial.print("screen: ");
    Serial.println(screen.size());
#endif

    if (screen.size()) {
#ifdef _DEBUG_
      Serial.println("screen has character(s)");
      Serial.print("pos: ");
      Serial.println(screen.front().pos);
      Serial.print("width: ");
      Serial.println(screen.front().character.width);
#endif
      if(screen.front().pos + screen.front().character.width <= 0) {
#ifdef _DEBUG_
        Serial.println("letter falls off");
#endif
        screen.erase(screen.begin());
      }
      if (text.size() && (screen.back().pos + screen.back().character.width < 9)) {
        // Rightmost letter is all the way on screen:
        // add another letter if any are left
#ifdef _DEBUG_
        Serial.println("rightmost letter completely on screen");
#endif
        screen.push_back({ letters[text.front()], 9, color });
        text.erase(text.begin());
      }
    } else {
      // Nothing on screen yet
#ifdef _DEBUG_
      Serial.println("Nothing on screen yet");
#endif
      screen.push_back({ letters[text.front()], 9, color });
      text.erase(text.begin());
    }

    // Draw the screen
    for (int i = 0; i < screen.size(); i++) {
      Letter l = screen.at(i);
      draw_letter(l.character.data, l.pos, l.color);
      screen.at(i) = {l.character, l.pos - 1, l.color};
    }
    show();
    delay(200 / speed);
    clear();
  }
}