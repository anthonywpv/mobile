import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { chatbubblesOutline } from 'ionicons/icons';

import '@ionic/react/css/core.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './App.css';

import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>

        <Route exact path="/welcome" component={WelcomePage} />
        <Route exact path="/chat" component={ChatPage} />

        <Route path="/dashboard" component={DashboardLayout} />

        <Route exact path="/">
          <Redirect to="/welcome" />
        </Route>

        <Route render={() => <Redirect to="/welcome" />} />

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);


const DashboardLayout: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/dashboard" component={DashboardPage} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="chat" href="/chat">
          <IonIcon aria-hidden="true" icon={chatbubblesOutline} />
          <IonLabel>Chat</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};


export default App;