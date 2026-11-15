import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@controle_gastos';
const CATEGORIAS = ['Alimentação', 'Transporte', 'Lazer', 'Outros'];

export default function NovoGastoScreen({ navigation }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Alimentação');
  const [erro, setErro] = useState('');

  const salvarGasto = async () => {
    const descricaoLimpa = descricao.trim();

    let valorLimpo = valor.trim().replace(/[R$\s]/g, '');

    if (valorLimpo.includes(',')) {
      valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
    } else if ((valorLimpo.match(/\./g) || []).length > 1) {
      const partes = valorLimpo.split('.');
      const centavos = partes.pop();
      valorLimpo = `${partes.join('')}.${centavos}`;
    }

    const valorNumerico = Number(valorLimpo);

    if (!descricaoLimpa) {
      setErro('Informe uma descrição para o gasto.');
      return;
    }

    if (!valor.trim() || Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      setErro('Informe um valor maior que zero.');
      return;
    }

    try {
      const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);
      const gastosAtuais = dadosSalvos ? JSON.parse(dadosSalvos) : [];

      const novoGasto = {
        id: Date.now().toString(),
        descricao: descricaoLimpa,
        valor: valorNumerico,
        categoria,
      };

      const novaLista = [...gastosAtuais, novoGasto];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));

      setDescricao('');
      setValor('');
      setCategoria('Alimentação');
      setErro('');

      navigation.goBack();
    } catch (error) {
      setErro('Não foi possível salvar o gasto. Tente novamente.');
      console.log('Erro ao salvar gasto:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.conteudo}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.botaoVoltarTexto}>‹ Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Novo gasto</Text>
          <Text style={styles.subtitulo}>
            Registre uma despesa para acompanhar seu total.
          </Text>

          <View style={styles.formulario}>
            <Text style={styles.label}>Descrição</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Almoço"
              placeholderTextColor="#A3AEA7"
              value={descricao}
              onChangeText={(texto) => {
                setDescricao(texto);
                setErro('');
              }}
            />

            <Text style={styles.label}>Valor</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 35,90"
              placeholderTextColor="#A3AEA7"
              value={valor}
              onChangeText={(texto) => {
                setValor(texto);
                setErro('');
              }}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Categoria</Text>

            <View style={styles.categoriasContainer}>
              {CATEGORIAS.map((item) => {
                const selecionada = categoria === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.categoriaChip,
                      selecionada && styles.categoriaChipAtiva,
                    ]}
                    onPress={() => setCategoria(item)}
                  >
                    <Text
                      style={[
                        styles.categoriaTexto,
                        selecionada && styles.categoriaTextoAtivo,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {erro ? (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTexto}>⚠ {erro}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={salvarGasto}
            >
              <Text style={styles.botaoSalvarTexto}>Salvar gasto</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },

  conteudo: {
    padding: 22,
    paddingBottom: 40,
  },

  botaoVoltar: {
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 28,
  },

  botaoVoltarTexto: {
    color: '#0B8F4D',
    fontSize: 17,
    fontWeight: 'bold',
  },

  titulo: {
    color: '#1E2923',
    fontSize: 30,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#7C8981',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 22,
  },

  formulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  label: {
    color: '#1E2923',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDE7DF',
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: '#1E2923',
    fontSize: 16,
    backgroundColor: '#FBFDFC',
    marginBottom: 16,
  },

  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  categoriaChip: {
    borderWidth: 1,
    borderColor: '#DDE7DF',
    backgroundColor: '#FBFDFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  categoriaChipAtiva: {
    backgroundColor: '#16C76B',
    borderColor: '#16C76B',
  },

  categoriaTexto: {
    color: '#1E2923',
    fontSize: 14,
    fontWeight: '600',
  },

  categoriaTextoAtivo: {
    color: '#FFFFFF',
  },

  erroContainer: {
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    marginBottom: 18,
  },

  erroTexto: {
    color: '#C9363D',
    fontSize: 14,
    fontWeight: '600',
  },

  botaoSalvar: {
    backgroundColor: '#16C76B',
    borderRadius: 16,
    padding: 17,
    alignItems: 'center',
    marginTop: 12,
  },

  botaoSalvarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});