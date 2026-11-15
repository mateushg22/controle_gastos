# Control gastos

Aplicativo mobile simples para controle de despesas diárias, desenvolvido em **React Native** com **Expo**.

## Funcionalidades
- Cadastro de gastos com descrição, valor e categoria (`Alimentação`, `Transporte`, `Lazer`, `Outros`)
- Validação de formulário com alertas visuais antes de salvar
- Cálculo automático e dinâmico do total gasto
- Destaque visual para despesas acima de R$ 100,00
- Exclusão individual de itens e opção **Limpar tudo** para zerar a lista
- Armazenamento local persistente utilizando `AsyncStorage`

## Tecnologias utilizadas
- React Native
- Expo
- React Navigation (Native Stack)
- AsyncStorage (`@react-native-async-storage/async-storage`)

## Como executar o projeto
1. Instale as dependências:
   ```bash
   npm install

2. Inicie o projeto:
   `npx expo start`
