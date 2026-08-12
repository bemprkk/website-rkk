import { type FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, User, Mail, Phone, HelpCircle, MessageSquare } from 'lucide-react';

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationForm: FC<RegistrationFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', category: 'Pertanyaan Umum', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    // Simpan ke localStorage agar sejalan dengan Contact.tsx
    const newMessage = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      whatsapp: formData.phone,
      subject: `[${formData.category}] Kontak via Popup`,
      message: formData.message,
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('bemprkk_messages') || '[]');
      localStorage.setItem('bemprkk_messages', JSON.stringify([newMessage, ...existing]));
    } catch (err) {
      console.error('Error saving message:', err);
    }

    setIsLoading(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', category: 'Pertanyaan Umum', message: '' });
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="reg-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="reg-modal"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="reg-close-btn" onClick={onClose}><X size={20} /></button>

            {isSubmitted ? (
              <div className="reg-success">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <CheckCircle size={64} color="#ff4500" />
                </motion.div>
                <h3>Pesan Terkirim!</h3>
                <p>Terima kasih! Pesan Anda telah diterima. Tim BEMPRKK akan menanggapi pesan kamu segera.</p>
              </div>
            ) : (
              <>
                <div className="reg-header">
                  <h2>Hubungi <span className="text-gradient-elegant">BEMPRKK</span></h2>
                  <p>Kirim pesan, pertanyaan, atau aspirasi Anda langsung kepada kami.</p>
                </div>
                <form onSubmit={handleSubmit} className="reg-form">
                  <div className="reg-field">
                    <label><User size={14} /> Nama Lengkap</label>
                    <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Masukkan nama lengkap Anda" />
                  </div>
                  <div className="reg-field">
                    <label><Mail size={14} /> Email</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="nama@email.com" />
                  </div>
                  <div className="reg-field">
                    <label><Phone size={14} /> Nomor WhatsApp</label>
                    <input required value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="08xxxxxxxxxx" />
                  </div>
                  <div className="reg-field">
                    <label><HelpCircle size={14} /> Kategori Keperluan</label>
                    <select required value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}>
                      <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                      <option value="Kolaborasi / Partnership">Kolaborasi / Partnership</option>
                      <option value="Kritik / Saran / Aspirasi">Kritik / Saran / Aspirasi</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="reg-field">
                    <label><MessageSquare size={14} /> Isi Pesan / Pertanyaan</label>
                    <textarea required value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} placeholder="Tuliskan pesan, pertanyaan, atau aspirasi Anda..." rows={4} />
                  </div>
                  <button type="submit" className="btn-hero-primary reg-submit-btn">
                    {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationForm;
