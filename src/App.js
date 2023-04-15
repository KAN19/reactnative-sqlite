/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  createTable,
  getDBConnection,
  getUsers,
  updateUser,
} from './modules/sqllite.module';
import AddUser from './screen/adduser';
import UserList from './screen/users';

const Stack = createNativeStackNavigator();

const App = () => {
  const [savedUsers, setsavedUsers] = useState([]);
  console.log('dummy');
  const loadInitialData = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const initData = await getUsers(db);
      if (initData.length > 0) {
        setsavedUsers(initData);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onUpdate = (id, changes) => {
    console.log(id, changes);
    const data = savedUsers;
    const index = data.findIndex(d => d.id === id);
    data[index] = changes;

    updateUser(data[index]);
  };
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Users">
          {props => (
            <UserList
              initData={savedUsers}
              {...props}
              load={loadInitialData}
              deleteu={id => setsavedUsers(savedUsers.filter(u => u.id != id))}
              updateu={data => onUpdate(data.id, data)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Add">
          {props => (
            <AddUser
              {...props}
              add={user => setsavedUsers(savedUsers.concat(user))}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
