import logo from './logo.svg';
import './App.css';
import PngToWebp from './Components/PngToWebp';
import ImageToWebp from './Components/ImageToWebp';
import YtDownload from './Components/YtDownload';
import { Provider } from 'react-redux'
import appStore from './utils/appStore';
function App() {
  return (

    <div className="App">
    
        {/* <PngToWebp /> */}
        {/* <ImageToWebp /> */}
    <Provider store={appStore}>
        <YtDownload />
    </Provider>
  
        
    </div>
  );
}

export default App;
