import { Toaster } from 'react-hot-toast';
import SubmissionForm from './components/SubmissionForm';

function App() {
  return (
    <div className="app-container">
      <Toaster position="top-center" reverseOrder={false} />
      <SubmissionForm />
      </div>
  );
}

export default App;
