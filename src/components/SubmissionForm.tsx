import { useState } from 'react';
import axios from 'axios';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';
import styles from './SubmissionForm.module.css';
import TermsModal from './TermsModal';

const SubmissionForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !phone || !image) {
      toast.error('Please fill out all fields and select an image.');
      return;
    }
    setIsTermsModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!image) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your artwork...');

    try {
      const formData = new FormData();
      formData.append('image', image);
      const imgbbApiKey = '3c4e681b2f5c0d00e228a0d02ef74def';

      const imgbbRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );

      const imageUrl = imgbbRes.data.data.url;
      const deleteUrl = imgbbRes.data.data.delete_url;

      await addDoc(collection(db, 'submissions'), {
        name,
        age: parseInt(age),
        phone,
        imageUrl,
        deleteUrl,
        submittedAt: new Date(),
        imgbbResponse: imgbbRes.data.data,
      });

      toast.success('Artwork submitted successfully! All the best!', { id: toastId });
      setIsSubmitted(true);
      setIsTermsModalOpen(false);

    } catch (error) {
      console.error('Submission Error:', error);
      toast.error('Something went wrong. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setAge('');
    setPhone('');
    setImage(null);
    setIsSubmitted(false);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  if (isSubmitted) {
    return (
      <div className={styles['thank-you-container']}>
        <h1 className={styles.title}>Thank You!</h1>
        <p className={styles['thank-you-message']}>
          Your artwork has been submitted successfully. We wish you the best of luck in the competition!
        </p>
        <button onClick={handleResetForm} className={styles['reset-button']}>
          Submit Another Artwork
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles['form-container']}>
        <div className={styles.header}>
          <h1 className={styles.title}>DAAMIEVENT Presents</h1>
          <h2 className={styles.subtitle}>Sikkim Creative Star Art Competition</h2>
          <p className={styles.description}>Submit your artwork below. All the best!</p>
        </div>

        <form onSubmit={handleFormSubmit} className={styles.form}>
          <div className={styles['input-group']}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="number"
              placeholder="Your Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.input}
            required
          />
          
          <div>
              <label htmlFor="file-upload" className={styles['file-upload-label']}>
                  Upload your Artwork
              </label>
              <label htmlFor="file-upload" className={styles['file-drop-zone']}>
                  <div className={styles['file-drop-content']}>
                      <svg className={styles['file-icon']} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className={styles['file-text']}>
                          <span className={styles['upload-button']}>Upload a file</span> or drag and drop
                      </div>
                      <p className={styles['file-format-info']}>PNG, JPG, GIF up to 32MB</p>
                      {image && <p className={styles['file-info']}>{image.name}</p>}
                  </div>
                  <input id="file-upload" name="file-upload" type="file" className={styles['sr-only']} onChange={handleFileChange} accept="image/*" />
              </label>
          </div>


          <button
            type="submit"
            className={styles['submit-button']}
          >
            Submit Artwork
          </button>
        </form>
      </div>
      <TermsModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onConfirm={handleFinalSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default SubmissionForm; 