import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const STORAGE_KEY = '@controle_gastos';

export default function GastosScreen({ navigation }) {
  const [gastos, setGastos] = useState([]);

  const carregarGastos = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);

      if (dadosSalvos) {
        setGastos(JSON.parse(dadosSalvos));
      } else {
        setGastos([]);
      }
    } catch (error) {
      console.log('Erro ao carregar gastos:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarGastos();
    }, [])
  );

  const excluirGasto = async (id) => {
    const novaLista = gastos.filter((gasto) => gasto.id !== id);

    setGastos(novaLista);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
  };

  const limparTudo = async () => {
    setGastos([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const total = gastos.reduce((soma, gasto) => soma + gasto.valor, 0);

  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const renderItem = ({ item }) => {
    const acimaDeCem = item.valor > 100;

    return (
      <View
        style={[
          styles.gastoCard,
          acimaDeCem && styles.gastoCardDestaque,
        ]}
      >
        <View
          style={[
            styles.icone,
            acimaDeCem && styles.iconeDestaque,
          ]}
        >
          <Text style={styles.iconeTexto}>💸</Text>
        </View>

        <View style={styles.informacoes}>
          <Text style={styles.descricao}>{item.descricao}</Text>
          <Text style={styles.data}>{item.categoria || 'Outros'}</Text>
        </View>

        <View style={styles.valorArea}>
          <Text
            style={[
              styles.valor,
              acimaDeCem && styles.valorDestaque,
            ]}
          >
            {formatarMoeda(item.valor)}
          </Text>

          <TouchableOpacity onPress={() => excluirGasto(item.id)}>
            <Text style={styles.excluir}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={gastos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <>
            <Text style={styles.marcaApp}>Controle seus Gastos</Text>
            <Text style={styles.ola}>Olá, Mateus! </Text>
            <Text style={styles.subtitulo}>
              Controle seus gastos de forma simples
            </Text>

            <View style={styles.totalCard}>
              <Text style={styles.totalTitulo}>Total gasto</Text>
              <Text style={styles.totalValor}>{formatarMoeda(total)}</Text>
              <Text style={styles.totalDescricao}>
                Soma dos seus gastos registrados
              </Text>
            </View>

            <View style={styles.tituloListaArea}>
              <Text style={styles.tituloLista}>Gastos recentes</Text>

              <View style={styles.acoesLista}>
                <Text style={styles.quantidade}>
                  {gastos.length} {gastos.length === 1 ? 'item' : 'itens'}
                </Text>

                {gastos.length > 0 && (
                  <TouchableOpacity onPress={limparTudo}>
                    <Text style={styles.limparTudo}>Limpar tudo</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioIcone}>📝</Text>
            <Text style={styles.vazioTitulo}>Nenhum gasto registrado</Text>
            <Text style={styles.vazioTexto}>
              Adicione seu primeiro gasto usando o botão abaixo.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => navigation.navigate('NovoGasto')}
      >
        <Text style={styles.botaoAdicionarTexto}>＋ Adicionar gasto</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },

  lista: {
    padding: 22,
    paddingBottom: 110,
  },

  marcaApp: {
    color: '#0B8F4D',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 14,
  },

  ola: {
    color: '#1E2923',
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 4,
  },

  subtitulo: {
    color: '#7C8981',
    fontSize: 15,
    marginTop: 6,
    marginBottom: 22,
  },

  totalCard: {
    backgroundColor: '#16C76B',
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    shadowColor: '#16C76B',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  totalTitulo: {
    color: '#DFFBEA',
    fontSize: 15,
  },

  totalValor: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 8,
  },

  totalDescricao: {
    color: '#DFFBEA',
    fontSize: 13,
    marginTop: 8,
  },

  tituloListaArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  tituloLista: {
    color: '#1E2923',
    fontSize: 20,
    fontWeight: 'bold',
  },

  acoesLista: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  quantidade: {
    color: '#7C8981',
    fontSize: 13,
  },

  limparTudo: {
    color: '#E5484D',
    fontSize: 13,
    fontWeight: 'bold',
  },

  gastoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  gastoCardDestaque: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },

  icone: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E8F9EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeDestaque: {
    backgroundColor: '#FFEDD5',
  },

  iconeTexto: {
    fontSize: 22,
  },

  informacoes: {
    flex: 1,
    marginLeft: 12,
  },

  descricao: {
    color: '#1E2923',
    fontSize: 16,
    fontWeight: 'bold',
  },

  data: {
    color: '#98A39C',
    fontSize: 12,
    marginTop: 4,
  },

  valorArea: {
    alignItems: 'flex-end',
  },

  valor: {
    color: '#0B8F4D',
    fontSize: 15,
    fontWeight: 'bold',
  },

  valorDestaque: {
    color: '#EA580C',
  },

  excluir: {
    color: '#E5484D',
    fontSize: 12,
    marginTop: 7,
  },

  vazio: {
    alignItems: 'center',
    padding: 30,
  },

  vazioIcone: {
    fontSize: 40,
  },

  vazioTitulo: {
    color: '#1E2923',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 12,
  },

  vazioTexto: {
    color: '#7C8981',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },

  botaoAdicionar: {
    position: 'absolute',
    bottom: 22,
    left: 22,
    right: 22,
    backgroundColor: '#16C76B',
    borderRadius: 18,
    padding: 17,
    alignItems: 'center',
    elevation: 5,
  },

  botaoAdicionarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});