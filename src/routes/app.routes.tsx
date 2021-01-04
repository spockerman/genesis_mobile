import React from 'react';
import { createStackNavigator, HeaderBackground }  from '@react-navigation/stack';
import Dashboard from '../pages/Dashboard';


const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator screenOptions={{
    headerShown:true,
    cardStyle:{backgroundColor:'#00EBC1'}}}>
    <App.Screen name="Dashboard" component={Dashboard}/>
  </App.Navigator>
);


export default AppRoutes;
