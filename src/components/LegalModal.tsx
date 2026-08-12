import { type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { createPortal } from 'react-dom';

export type LegalType = 'privacy' | 'terms' | null;

interface LegalModalProps {
  type: LegalType;
  onClose: () => void;
}

const LegalModal: FC<LegalModalProps> = ({ type, onClose }) => {
  const { lang } = useLanguage();

  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="reg-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{ zIndex: 999999, padding: '1rem' }}
      >
        <motion.div
          className="reg-modal"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}
        >
          <button className="reg-close-btn" onClick={onClose}><X size={20} /></button>

          <div className="reg-header" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem' }}>
              {isPrivacy 
                ? (lang === 'EN' ? 'Privacy ' : 'Kebijakan ')
                : (lang === 'EN' ? 'Terms of ' : 'Syarat ')}
              <span className="text-gradient-elegant">
                {isPrivacy 
                  ? (lang === 'EN' ? 'Policy' : 'Privasi')
                  : (lang === 'EN' ? 'Use' : 'Penggunaan')}
              </span>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--clr-muted)' }}>
              {lang === 'EN' ? 'Legal Information & Policies' : 'Informasi Legal & Kebijakan'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--clr-text-2)', lineHeight: '1.7', fontSize: '0.95rem' }}>
            {isPrivacy ? (
              <>
                <section>
                  <h3 style={{ color: 'var(--clr-text)', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} color="var(--clr-accent)" />
                    {lang === 'EN' ? '1. Information We Collect' : '1. Informasi yang Kami Kumpulkan'}
                  </h3>
                  <p style={{ textAlign: 'justify' }}>
                    {lang === 'EN'
                      ? 'BEMPRKK collects information you provide directly to us when you fill out forms, register for events, or contact us. This may include your name, student ID, email address, and other relevant details.'
                      : 'BEMPRKK mengumpulkan informasi yang Anda berikan secara langsung saat Anda mengisi formulir, mendaftar kegiatan, atau menghubungi kami. Ini dapat mencakup nama, NPM, alamat email, dan data relevan lainnya.'}
                  </p>
                </section>
                <section>
                  <h3 style={{ color: 'var(--clr-text)', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} color="var(--clr-accent)" />
                    {lang === 'EN' ? '2. How We Use Information' : '2. Penggunaan Informasi'}
                  </h3>
                  <p style={{ textAlign: 'justify' }}>
                    {lang === 'EN'
                      ? 'We use the information we collect to communicate with you, process your event registrations, and improve our programs. We do not sell your personal information to third parties.'
                      : 'Kami menggunakan informasi yang dikumpulkan untuk berkomunikasi dengan Anda, memproses pendaftaran kegiatan, dan meningkatkan kualitas program kerja kami. Kami tidak pernah menjual data pribadi Anda kepada pihak ketiga.'}
                  </p>
                </section>
                <section>
                  <h3 style={{ color: 'var(--clr-text)', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={18} color="var(--clr-accent)" />
                    {lang === 'EN' ? '3. Data Security' : '3. Keamanan Data'}
                  </h3>
                  <p style={{ textAlign: 'justify' }}>
                    {lang === 'EN'
                      ? 'We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.'
                      : 'Kami mengambil langkah-langkah pengamanan yang wajar untuk melindungi informasi Anda dari kehilangan, pencurian, penyalahgunaan, akses tanpa izin, dan perubahan.'}
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h3 style={{ color: 'var(--clr-text)', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={18} color="var(--clr-accent)" />
                    {lang === 'EN' ? '1. Acceptance of Terms' : '1. Penerimaan Syarat'}
                  </h3>
                  <p style={{ textAlign: 'justify' }}>
                    {lang === 'EN'
                      ? 'By accessing and using the BEMPRKK website, you accept and agree to be bound by the terms and provision of this agreement.'
                      : 'Dengan mengakses dan menggunakan situs web BEMPRKK, Anda menerima dan setuju untuk terikat oleh syarat dan ketentuan perjanjian ini.'}
                  </p>
                </section>
                <section>
                  <h3 style={{ color: 'var(--clr-text)', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={18} color="var(--clr-accent)" />
                    {lang === 'EN' ? '2. Use of Content' : '2. Penggunaan Konten'}
                  </h3>
                  <p style={{ textAlign: 'justify' }}>
                    {lang === 'EN'
                      ? 'All content provided on this website is for informational purposes only. The content may not be reproduced, distributed, or transmitted in any form without prior written permission.'
                      : 'Semua konten yang disediakan di situs web ini hanya untuk tujuan informasi. Konten tidak boleh direproduksi, didistribusikan, atau ditransmisikan dalam bentuk apa pun tanpa izin tertulis sebelumnya.'}
                  </p>
                </section>
                <section>
                  <h3 style={{ color: 'var(--clr-text)', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={18} color="var(--clr-accent)" />
                    {lang === 'EN' ? '3. User Conduct' : '3. Perilaku Pengguna'}
                  </h3>
                  <p style={{ textAlign: 'justify' }}>
                    {lang === 'EN'
                      ? 'You agree to use the website only for lawful purposes. You are prohibited from violating or attempting to violate the security of the website.'
                      : 'Anda setuju untuk menggunakan situs web ini hanya untuk tujuan yang sah. Anda dilarang melanggar atau mencoba melanggar keamanan situs web ini.'}
                  </p>
                </section>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default LegalModal;
