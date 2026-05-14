import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider, Text, Surface, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

// Ancient Egyptian Hieroglyphic Mapping
const HIEROGLYPHS = {
  '0': '\u{13124}', // nfr (beauty/zero/complete)
  '1': '\u{133FA}', // single stroke
  '2': '\u{133FB}', // two strokes
  '3': '\u{133FC}', // three strokes
  '4': '\u{133FD}', // ...
  '5': '\u{133FE}',
  '6': '\u{133FF}',
  '7': '\u{13400}',
  '8': '\u{13401}',
  '9': '\u{13402}',
  '+': '\u{130BB}', // walking legs toward
  '-': '\u{130BD}', // walking legs away
  '*': '\u{133F4}', // crossed sticks
  '/': '\u{1340D}', // pool/division
  '=': '\u{13076}', // head/result
  'C': '\u{132F4}', // folded cloth (clear)
  '.': '\u{133F2}', // small mark
};

const CalculatorButton = ({ label, onPress, color, flex = 1, textColor = '#E0E0E0' }) => {
  const displayLabel = HIEROGLYPHS[label] || label;
  return (
    <Surface style={[styles.buttonSurface, { flex }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color || '#2C2C2C' }]}
        onPress={() => onPress(label)}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>{displayLabel}</Text>
      </TouchableOpacity>
    </Surface>
  );
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handlePress = (value) => {
    if (value === 'C') {
      setDisplay('0');
      setEquation('');
      setShouldResetDisplay(false);
      return;
    }

    if (value === '=') {
      calculateResult();
      return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
      setEquation(display + ' ' + value + ' ');
      setShouldResetDisplay(true);
      return;
    }

    if (value === '.') {
      if (!display.includes('.')) {
        setDisplay(display + '.');
      }
      return;
    }

    // Number input
    if (display === '0' || shouldResetDisplay) {
      setDisplay(value);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + value);
    }
  };

  const calculateResult = () => {
    try {
      const fullExpression = equation + display;
      // We use a safe evaluation approach by replacing operators
      const mathExpression = fullExpression
        .replace(/ /g, '')
        .replace(/x/g, '*') // in case we used 'x'
        .replace(/÷/g, '/'); // in case we used '÷'
      
      const result = eval(mathExpression);
      
      if (!isFinite(result)) {
        setDisplay('Error');
      } else {
        // Limit precision
        const formattedResult = Number(result.toFixed(8)).toString();
        setDisplay(formattedResult);
        setEquation('');
      }
      setShouldResetDisplay(true);
    } catch (e) {
      setDisplay('Error');
      setEquation('');
      setShouldResetDisplay(true);
    }
  };

  const renderHieroglyphs = (text) => {
    if (text === 'Error') return <Text style={styles.displayText}>𓏴𓏴𓏴</Text>;
    return text.split('').map((char, index) => (
      <Text key={index} style={styles.displayText}>
        {HIEROGLYPHS[char] || char}
      </Text>
    ));
  };

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>𓐍𓄤𓂻𓏺 𓁶𓏺𓃠𓏺𓈙𓏺</Text>
          <Text style={styles.headerSubtitle}>SCRIBE CALCULATOR</Text>
        </View>

        <Surface style={styles.displayContainer}>
          <View style={styles.equationArea}>
            <Text style={styles.equationText}>{equation}</Text>
          </View>
          <View style={styles.displayArea}>
            <View style={styles.glyphRow}>
              {renderHieroglyphs(display)}
            </View>
            <Text style={styles.standardResult}>{display}</Text>
          </View>
        </Surface>

        <View style={styles.keypad}>
          <View style={styles.row}>
            <CalculatorButton label="C" onPress={handlePress} color="#5D4037" flex={2} />
            <CalculatorButton label="/" onPress={handlePress} color="#B8860B" textColor="#000" />
            <CalculatorButton label="*" onPress={handlePress} color="#B8860B" textColor="#000" />
          </View>
          <View style={styles.row}>
            <CalculatorButton label="7" onPress={handlePress} />
            <CalculatorButton label="8" onPress={handlePress} />
            <CalculatorButton label="9" onPress={handlePress} />
            <CalculatorButton label="-" onPress={handlePress} color="#B8860B" textColor="#000" />
          </View>
          <View style={styles.row}>
            <CalculatorButton label="4" onPress={handlePress} />
            <CalculatorButton label="5" onPress={handlePress} />
            <CalculatorButton label="6" onPress={handlePress} />
            <CalculatorButton label="+" onPress={handlePress} color="#B8860B" textColor="#000" />
          </View>
          <View style={styles.row}>
            <CalculatorButton label="1" onPress={handlePress} />
            <CalculatorButton label="2" onPress={handlePress} />
            <CalculatorButton label="3" onPress={handlePress} />
            <CalculatorButton label="=" onPress={handlePress} color="#D4AF37" textColor="#000" />
          </View>
          <View style={styles.row}>
            <CalculatorButton label="0" onPress={handlePress} flex={2} />
            <CalculatorButton label="." onPress={handlePress} />
            <View style={{ flex: 1 }} />
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#D4AF37',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 10,
  },
  headerSubtitle: {
    color: '#8B7355',
    fontSize: 12,
    letterSpacing: 4,
    marginTop: 5,
  },
  displayContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    elevation: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    minHeight: 180,
    justifyContent: 'space-between',
  },
  equationArea: {
    alignItems: 'flex-end',
    height: 30,
  },
  equationText: {
    color: '#8B7355',
    fontSize: 18,
  },
  displayArea: {
    alignItems: 'flex-end',
  },
  glyphRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  displayText: {
    color: '#D4AF37',
    fontSize: 50,
    lineHeight: 60,
  },
  standardResult: {
    color: 'rgba(212, 175, 55, 0.4)',
    fontSize: 16,
    marginTop: 5,
  },
  keypad: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end',
    backgroundColor: '#000',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonSurface: {
    margin: 5,
    borderRadius: 15,
    elevation: 4,
    overflow: 'hidden',
  },
  button: {
    height: width / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
