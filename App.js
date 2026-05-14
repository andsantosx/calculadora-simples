/**
 * Scribe Calculator - An Ancient Egyptian Hieroglyphic Calculator
 * Built with React Native, Expo, and React Native Paper (Material Design 3).
 */

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions } from 'react-native';
import { 
  Provider as PaperProvider, 
  Text, 
  Surface, 
  MD3DarkTheme, 
  Button, 
  Appbar 
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// --- CONFIGURATION & CONSTANTS ---

const { width } = Dimensions.get('window');

const HIEROGLYPHS = {
  '0': '\u{13124}',
  '1': '\u{133FA}',
  '2': '\u{133FB}',
  '3': '\u{133FC}',
  '4': '\u{133FD}',
  '5': '\u{133FE}',
  '6': '\u{133FF}',
  '7': '\u{13400}',
  '8': '\u{13401}',
  '9': '\u{13402}',
  '+': '\u{130BB}',
  '-': '\u{130BD}',
  '*': '\u{133F4}',
  '/': '\u{1340D}',
  '=': '\u{13076}',
  'C': '\u{132F4}',
  '.': '\u{133F2}',
  'Error': '𓏴𓏴𓏴',
};

// --- COMPONENTS ---

/**
 * Display component for Hieroglyphic sequences
 */
const GlyphDisplay = ({ text }) => {
  if (text === 'Error') {
    return <Text variant="displayLarge" style={styles.glyphText}>{HIEROGLYPHS.Error}</Text>;
  }

  return (
    <View style={styles.glyphRow}>
      {text.split('').map((char, index) => (
        <Text key={`${char}-${index}`} variant="displayLarge" style={styles.glyphText}>
          {HIEROGLYPHS[char] || char}
        </Text>
      ))}
    </View>
  );
};

/**
 * Calculator Button using React Native Paper's Button component
 */
const CalcButton = ({ label, onPress, mode = "contained-tonal", flex = 1, buttonColor, textColor }) => {
  const glyph = HIEROGLYPHS[label] || label;
  
  return (
    <Button
      mode={mode}
      onPress={() => onPress(label)}
      style={[styles.button, { flex }]}
      contentStyle={styles.buttonContent}
      buttonColor={buttonColor}
      textColor={textColor}
      labelStyle={styles.buttonLabel}
    >
      {glyph}
    </Button>
  );
};

// --- MAIN APPLICATION ---

export default function App() {
  const [currentValue, setCurrentValue] = useState('0');
  const [operator, setOperator] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [shouldResetScreen, setShouldResetScreen] = useState(false);

  const calculate = useCallback((first, second, op) => {
    const a = parseFloat(first);
    const b = parseFloat(second);
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 'Error';
      default: return b;
    }
  }, []);

  const handleInput = (input) => {
    if (input === 'C') {
      setCurrentValue('0');
      setOperator(null);
      setPreviousValue(null);
      setShouldResetScreen(false);
      return;
    }

    if (['+', '-', '*', '/'].includes(input)) {
      if (operator && !shouldResetScreen) {
        const result = calculate(previousValue, currentValue, operator);
        setPreviousValue(result.toString());
        setCurrentValue(result.toString());
      } else {
        setPreviousValue(currentValue);
      }
      setOperator(input);
      setShouldResetScreen(true);
      return;
    }

    if (input === '=') {
      if (!operator) return;
      const result = calculate(previousValue, currentValue, operator);
      setCurrentValue(result.toString());
      setOperator(null);
      setPreviousValue(null);
      setShouldResetScreen(true);
      return;
    }

    if (input === '.') {
      if (shouldResetScreen) {
        setCurrentValue('0.');
        setShouldResetScreen(false);
      } else if (!currentValue.includes('.')) {
        setCurrentValue(currentValue + '.');
      }
      return;
    }

    if (currentValue === '0' || shouldResetScreen) {
      setCurrentValue(input);
      setShouldResetScreen(false);
    } else {
      setCurrentValue(currentValue + input);
    }
  };

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        {/* Using Paper Appbar for Header */}
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content 
            title="𓐍𓄤𓂻𓏺 𓁶𓏺𓃠𓏺𓈙𓏺" 
            titleStyle={styles.appbarTitle} 
          />
        </Appbar.Header>

        {/* Display Surface */}
        <Surface style={styles.displaySurface} elevation={2}>
          <View style={styles.historyContainer}>
            <Text variant="titleMedium" style={styles.historyText}>
              {previousValue ? `${previousValue} ${operator || ''}` : ''}
            </Text>
          </View>
          <View style={styles.mainDisplay}>
            <GlyphDisplay text={currentValue} />
            <Text variant="labelSmall" style={styles.standardDigits}>
              {currentValue}
            </Text>
          </View>
        </Surface>

        {/* Keypad Grid */}
        <View style={styles.keypad}>
          <View style={styles.row}>
            <CalcButton label="C" onPress={handleInput} flex={2} buttonColor="#4E342E" mode="contained" />
            <CalcButton label="/" onPress={handleInput} buttonColor="#B8860B" mode="contained" textColor="#000" />
            <CalcButton label="*" onPress={handleInput} buttonColor="#B8860B" mode="contained" textColor="#000" />
          </View>

          <View style={styles.row}>
            <CalcButton label="7" onPress={handleInput} />
            <CalcButton label="8" onPress={handleInput} />
            <CalcButton label="9" onPress={handleInput} />
            <CalcButton label="-" onPress={handleInput} buttonColor="#B8860B" mode="contained" textColor="#000" />
          </View>

          <View style={styles.row}>
            <CalcButton label="4" onPress={handleInput} />
            <CalcButton label="5" onPress={handleInput} />
            <CalcButton label="6" onPress={handleInput} />
            <CalcButton label="+" onPress={handleInput} buttonColor="#B8860B" mode="contained" textColor="#000" />
          </View>

          <View style={styles.row}>
            <CalcButton label="1" onPress={handleInput} />
            <CalcButton label="2" onPress={handleInput} />
            <CalcButton label="3" onPress={handleInput} />
            <CalcButton label="=" onPress={handleInput} buttonColor="#D4AF37" mode="contained" textColor="#000" />
          </View>

          <View style={styles.row}>
            <CalcButton label="0" onPress={handleInput} flex={2} />
            <CalcButton label="." onPress={handleInput} />
            <View style={{ flex: 1 }} />
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  appbar: {
    backgroundColor: 'transparent',
    elevation: 0,
    justifyContent: 'center',
    height: 80,
  },
  appbarTitle: {
    color: '#D4AF37',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  displaySurface: {
    margin: 16,
    padding: 20,
    borderRadius: 28,
    backgroundColor: '#1C1B1F', // Material 3 Surface Color
    minHeight: 180,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  historyContainer: {
    alignItems: 'flex-end',
    minHeight: 30,
  },
  historyText: {
    color: '#8B7355',
  },
  mainDisplay: {
    alignItems: 'flex-end',
  },
  glyphRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  glyphText: {
    color: '#D4AF37',
  },
  standardDigits: {
    color: 'rgba(212, 175, 55, 0.3)',
    marginTop: 4,
  },
  keypad: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 24,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    margin: 6,
    borderRadius: 20,
  },
  buttonContent: {
    height: width / 5.2,
  },
  buttonLabel: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
