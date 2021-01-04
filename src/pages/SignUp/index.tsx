import React, { useCallback, useRef } from 'react';
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import { Container,
  Title,
  BackToLoginButton,
  BackToLoginButtonText,
} from './styles';
import logoImg from '../../assets/logo.png';
import { useNavigation } from '@react-navigation/native';



const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  interface SignUpFormData{
    name: string;
    email:string;
    password:string;
  }


  const handleSubmit = useCallback(async (data:SignUpFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um E-mail válido'),
        password: Yup.string().min(8, 'No mínimo 8 digitos'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      await api.post('/users', data);
      navigation.goBack();
      Alert.alert(
        'Cadastro realizado',
        'Voçê já pode fazer o seu login.');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const erros = getValidationErrors(err);
        formRef.current?.setErrors(erros);
      } else {
        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro no seu cadastro.',
        );
      }
    }
  }, [navigation]);

  return (
  <>
    <KeyboardAvoidingView
    style={{ flex:1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    enabled
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{flex:1}}>
        <Container>
          <Image source={logoImg}/>
          <View>
            <Title>Crie sua conta</Title>
          </View>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input
              autoCapitalize="words"
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={()=>{
                emailInputRef.current?.focus();
              }}
            />
            <Input
              ref={emailInputRef}
              name="email"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              onSubmitEditing={()=>{
                passwordInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordInputRef}
              textContentType="newPassword"
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing= {()=>{formRef.current?.submitForm();}}
              name="password"
              icon="lock"
              placeholder="Password"
            />
            <Button onPress={()=>{formRef.current?.submitForm();}}>Cadastrar</Button>
          </Form>
        </Container>
        </ScrollView>
    </KeyboardAvoidingView>
    <BackToLoginButton onPress={()=>navigation.goBack()}>
      <Icon name="arrow-left" size={20} color="#f4ede8"/>
      <BackToLoginButtonText>Voltar para logon</BackToLoginButtonText>
    </BackToLoginButton>
  </>
  );
}

export default SignUp;
