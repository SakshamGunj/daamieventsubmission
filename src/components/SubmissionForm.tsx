import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';
import styles from './SubmissionForm.module.css';
import TermsModal from './TermsModal';

const SubmissionForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [artworkLink, setArtworkLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !phone || !artworkLink) {
      toast.error('Please fill out all fields.');
      return;
    }
    setIsTermsModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your artwork...');

    try {
      await addDoc(collection(db, 'submissions'), {
        name,
        age: parseInt(age),
        phone,
        artworkLink,
        submittedAt: new Date(),
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
    setArtworkLink('');
    setIsSubmitted(false);
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
          <p className={styles.description}>Submit your artwork link below. All the best!</p>
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
            <label htmlFor="artwork-link" className={styles['file-upload-label']}>
                Artwork Link
            </label>
            <input
              id="artwork-link"
              type="text"
              placeholder="Paste your artwork link here"
              value={artworkLink}
              onChange={(e) => setArtworkLink(e.target.value)}
              className={styles.input}
              required
            />
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