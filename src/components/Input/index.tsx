import React, {useEffect, useRef, useImperativeHandle,  forwardRef, useState, useCallback} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

 import { Container, TextInput, Icon } from './styles';

 interface InputProps extends TextInputProps {
   name:string;
   icon:string;

 }

 interface inputValueReference {
   value:string;
 }
 interface InputRef {
   focus():void;

 }
const Input: React.ForwardRefRenderFunction<InputRef,InputProps> = ({name, icon, ...rest},ref,) => {
  const inputElementRef = useRef<any>(null);
  const { registerField, defaultValue='', fieldName, error} = useField(name);
  const inputValueRef = useRef<inputValueReference>({value:defaultValue});
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handelInputBlur = useCallback(()=>{
    setIsFocused(false);
    if(inputValueRef.current.value){
      setIsFilled(true);
    }
  }, []);

  const handelInputFocus = useCallback(()=>{
    setIsFocused(true);
  }, []);

  useImperativeHandle(ref, () => ({
    focus(){
      inputElementRef.current.focus();
    },
  }));

  useEffect(()=>{
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path:'value',
      setValue(ref:any, value){
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value});
      }, clearValue(){
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      }
    });
  }, [fieldName, registerField]);

return(<Container isFocused={isFocused} isErrored={!!error}>
  <Icon name={icon} size={20} color={isFocused || isFilled ? '#00EBC1' :'#666360'}/>
  <TextInput
    ref={inputElementRef}
    onFocus={handelInputFocus}
    onBlur={handelInputBlur}
    keyboardAppearance="dark"
    placeholderTextColor="#666360"
    defaultValue={defaultValue}
    onChangeText={(value) =>{
      inputValueRef.current.value = value
    }}
    {...rest}
  />
</Container>);
}

export default forwardRef(Input);
