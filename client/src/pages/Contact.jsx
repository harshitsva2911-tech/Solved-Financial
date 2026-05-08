import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { MapPin, Phone, Mail, Loader2, ChevronDown } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import PageHero from '../components/common/PageHero';
import AnimatedSection from '../components/common/AnimatedSection';
import FooterCTA from '../components/common/FooterCTA';
import Footer from '../components/common/Footer';
import API_BASE from '../utils/config';

const COUNTRY_CODES = [
  { code: '+93',  flag: 'ðŸ‡¦ðŸ‡«', name: 'Afghanistan' },
  { code: '+355', flag: 'ðŸ‡¦ðŸ‡±', name: 'Albania' },
  { code: '+213', flag: 'ðŸ‡©ðŸ‡¿', name: 'Algeria' },
  { code: '+376', flag: 'ðŸ‡¦ðŸ‡©', name: 'Andorra' },
  { code: '+244', flag: 'ðŸ‡¦ðŸ‡´', name: 'Angola' },
  { code: '+54',  flag: 'ðŸ‡¦ðŸ‡·', name: 'Argentina' },
  { code: '+374', flag: 'ðŸ‡¦ðŸ‡²', name: 'Armenia' },
  { code: '+61',  flag: 'ðŸ‡¦ðŸ‡º', name: 'Australia' },
  { code: '+43',  flag: 'ðŸ‡¦ðŸ‡¹', name: 'Austria' },
  { code: '+994', flag: 'ðŸ‡¦ðŸ‡¿', name: 'Azerbaijan' },
  { code: '+973', flag: 'ðŸ‡§ðŸ‡­', name: 'Bahrain' },
  { code: '+880', flag: 'ðŸ‡§ðŸ‡©', name: 'Bangladesh' },
  { code: '+375', flag: 'ðŸ‡§ðŸ‡¾', name: 'Belarus' },
  { code: '+32',  flag: 'ðŸ‡§ðŸ‡ª', name: 'Belgium' },
  { code: '+501', flag: 'ðŸ‡§ðŸ‡¿', name: 'Belize' },
  { code: '+229', flag: 'ðŸ‡§ðŸ‡¯', name: 'Benin' },
  { code: '+975', flag: 'ðŸ‡§ðŸ‡¹', name: 'Bhutan' },
  { code: '+591', flag: 'ðŸ‡§ðŸ‡´', name: 'Bolivia' },
  { code: '+387', flag: 'ðŸ‡§ðŸ‡¦', name: 'Bosnia & Herzegovina' },
  { code: '+267', flag: 'ðŸ‡§ðŸ‡¼', name: 'Botswana' },
  { code: '+55',  flag: 'ðŸ‡§ðŸ‡·', name: 'Brazil' },
  { code: '+673', flag: 'ðŸ‡§ðŸ‡³', name: 'Brunei' },
  { code: '+359', flag: 'ðŸ‡§ðŸ‡¬', name: 'Bulgaria' },
  { code: '+226', flag: 'ðŸ‡§ðŸ‡«', name: 'Burkina Faso' },
  { code: '+257', flag: 'ðŸ‡§ðŸ‡®', name: 'Burundi' },
  { code: '+855', flag: 'ðŸ‡°ðŸ‡­', name: 'Cambodia' },
  { code: '+237', flag: 'ðŸ‡¨ðŸ‡²', name: 'Cameroon' },
  { code: '+1',   flag: 'ðŸ‡¨ðŸ‡¦', name: 'Canada' },
  { code: '+238', flag: 'ðŸ‡¨ðŸ‡»', name: 'Cape Verde' },
  { code: '+236', flag: 'ðŸ‡¨ðŸ‡«', name: 'Central African Republic' },
  { code: '+235', flag: 'ðŸ‡¹ðŸ‡©', name: 'Chad' },
  { code: '+56',  flag: 'ðŸ‡¨ðŸ‡±', name: 'Chile' },
  { code: '+86',  flag: 'ðŸ‡¨ðŸ‡³', name: 'China' },
  { code: '+57',  flag: 'ðŸ‡¨ðŸ‡´', name: 'Colombia' },
  { code: '+269', flag: 'ðŸ‡°ðŸ‡²', name: 'Comoros' },
  { code: '+242', flag: 'ðŸ‡¨ðŸ‡¬', name: 'Congo' },
  { code: '+506', flag: 'ðŸ‡¨ðŸ‡·', name: 'Costa Rica' },
  { code: '+385', flag: 'ðŸ‡­ðŸ‡·', name: 'Croatia' },
  { code: '+53',  flag: 'ðŸ‡¨ðŸ‡º', name: 'Cuba' },
  { code: '+357', flag: 'ðŸ‡¨ðŸ‡¾', name: 'Cyprus' },
  { code: '+420', flag: 'ðŸ‡¨ðŸ‡¿', name: 'Czech Republic' },
  { code: '+45',  flag: 'ðŸ‡©ðŸ‡°', name: 'Denmark' },
  { code: '+253', flag: 'ðŸ‡©ðŸ‡¯', name: 'Djibouti' },
  { code: '+1',   flag: 'ðŸ‡©ðŸ‡´', name: 'Dominican Republic' },
  { code: '+593', flag: 'ðŸ‡ªðŸ‡¨', name: 'Ecuador' },
  { code: '+20',  flag: 'ðŸ‡ªðŸ‡¬', name: 'Egypt' },
  { code: '+503', flag: 'ðŸ‡¸ðŸ‡»', name: 'El Salvador' },
  { code: '+240', flag: 'ðŸ‡¬ðŸ‡¶', name: 'Equatorial Guinea' },
  { code: '+291', flag: 'ðŸ‡ªðŸ‡·', name: 'Eritrea' },
  { code: '+372', flag: 'ðŸ‡ªðŸ‡ª', name: 'Estonia' },
  { code: '+268', flag: 'ðŸ‡¸ðŸ‡¿', name: 'Eswatini' },
  { code: '+251', flag: 'ðŸ‡ªðŸ‡¹', name: 'Ethiopia' },
  { code: '+679', flag: 'ðŸ‡«ðŸ‡¯', name: 'Fiji' },
  { code: '+358', flag: 'ðŸ‡«ðŸ‡®', name: 'Finland' },
  { code: '+33',  flag: 'ðŸ‡«ðŸ‡·', name: 'France' },
  { code: '+241', flag: 'ðŸ‡¬ðŸ‡¦', name: 'Gabon' },
  { code: '+220', flag: 'ðŸ‡¬ðŸ‡²', name: 'Gambia' },
  { code: '+995', flag: 'ðŸ‡¬ðŸ‡ª', name: 'Georgia' },
  { code: '+49',  flag: 'ðŸ‡©ðŸ‡ª', name: 'Germany' },
  { code: '+233', flag: 'ðŸ‡¬ðŸ‡­', name: 'Ghana' },
  { code: '+30',  flag: 'ðŸ‡¬ðŸ‡·', name: 'Greece' },
  { code: '+502', flag: 'ðŸ‡¬ðŸ‡¹', name: 'Guatemala' },
  { code: '+224', flag: 'ðŸ‡¬ðŸ‡³', name: 'Guinea' },
  { code: '+245', flag: 'ðŸ‡¬ðŸ‡¼', name: 'Guinea-Bissau' },
  { code: '+592', flag: 'ðŸ‡¬ðŸ‡¾', name: 'Guyana' },
  { code: '+509', flag: 'ðŸ‡­ðŸ‡¹', name: 'Haiti' },
  { code: '+504', flag: 'ðŸ‡­ðŸ‡³', name: 'Honduras' },
  { code: '+852', flag: 'ðŸ‡­ðŸ‡°', name: 'Hong Kong' },
  { code: '+36',  flag: 'ðŸ‡­ðŸ‡º', name: 'Hungary' },
  { code: '+354', flag: 'ðŸ‡®ðŸ‡¸', name: 'Iceland' },
  { code: '+91',  flag: 'ðŸ‡®ðŸ‡³', name: 'India' },
  { code: '+62',  flag: 'ðŸ‡®ðŸ‡©', name: 'Indonesia' },
  { code: '+98',  flag: 'ðŸ‡®ðŸ‡·', name: 'Iran' },
  { code: '+964', flag: 'ðŸ‡®ðŸ‡¶', name: 'Iraq' },
  { code: '+353', flag: 'ðŸ‡®ðŸ‡ª', name: 'Ireland' },
  { code: '+972', flag: 'ðŸ‡®ðŸ‡±', name: 'Israel' },
  { code: '+39',  flag: 'ðŸ‡®ðŸ‡¹', name: 'Italy' },
  { code: '+225', flag: 'ðŸ‡¨ðŸ‡®', name: 'Ivory Coast' },
  { code: '+1',   flag: 'ðŸ‡¯ðŸ‡²', name: 'Jamaica' },
  { code: '+81',  flag: 'ðŸ‡¯ðŸ‡µ', name: 'Japan' },
  { code: '+962', flag: 'ðŸ‡¯ðŸ‡´', name: 'Jordan' },
  { code: '+7',   flag: 'ðŸ‡°ðŸ‡¿', name: 'Kazakhstan' },
  { code: '+254', flag: 'ðŸ‡°ðŸ‡ª', name: 'Kenya' },
  { code: '+965', flag: 'ðŸ‡°ðŸ‡¼', name: 'Kuwait' },
  { code: '+996', flag: 'ðŸ‡°ðŸ‡¬', name: 'Kyrgyzstan' },
  { code: '+856', flag: 'ðŸ‡±ðŸ‡¦', name: 'Laos' },
  { code: '+371', flag: 'ðŸ‡±ðŸ‡»', name: 'Latvia' },
  { code: '+961', flag: 'ðŸ‡±ðŸ‡§', name: 'Lebanon' },
  { code: '+266', flag: 'ðŸ‡±ðŸ‡¸', name: 'Lesotho' },
  { code: '+231', flag: 'ðŸ‡±ðŸ‡·', name: 'Liberia' },
  { code: '+218', flag: 'ðŸ‡±ðŸ‡¾', name: 'Libya' },
  { code: '+423', flag: 'ðŸ‡±ðŸ‡®', name: 'Liechtenstein' },
  { code: '+370', flag: 'ðŸ‡±ðŸ‡¹', name: 'Lithuania' },
  { code: '+352', flag: 'ðŸ‡±ðŸ‡º', name: 'Luxembourg' },
  { code: '+853', flag: 'ðŸ‡²ðŸ‡´', name: 'Macao' },
  { code: '+261', flag: 'ðŸ‡²ðŸ‡¬', name: 'Madagascar' },
  { code: '+265', flag: 'ðŸ‡²ðŸ‡¼', name: 'Malawi' },
  { code: '+60',  flag: 'ðŸ‡²ðŸ‡¾', name: 'Malaysia' },
  { code: '+960', flag: 'ðŸ‡²ðŸ‡»', name: 'Maldives' },
  { code: '+223', flag: 'ðŸ‡²ðŸ‡±', name: 'Mali' },
  { code: '+356', flag: 'ðŸ‡²ðŸ‡¹', name: 'Malta' },
  { code: '+222', flag: 'ðŸ‡²ðŸ‡·', name: 'Mauritania' },
  { code: '+230', flag: 'ðŸ‡²ðŸ‡º', name: 'Mauritius' },
  { code: '+52',  flag: 'ðŸ‡²ðŸ‡½', name: 'Mexico' },
  { code: '+373', flag: 'ðŸ‡²ðŸ‡©', name: 'Moldova' },
  { code: '+377', flag: 'ðŸ‡²ðŸ‡¨', name: 'Monaco' },
  { code: '+976', flag: 'ðŸ‡²ðŸ‡³', name: 'Mongolia' },
  { code: '+382', flag: 'ðŸ‡²ðŸ‡ª', name: 'Montenegro' },
  { code: '+212', flag: 'ðŸ‡²ðŸ‡¦', name: 'Morocco' },
  { code: '+258', flag: 'ðŸ‡²ðŸ‡¿', name: 'Mozambique' },
  { code: '+264', flag: 'ðŸ‡³ðŸ‡¦', name: 'Namibia' },
  { code: '+977', flag: 'ðŸ‡³ðŸ‡µ', name: 'Nepal' },
  { code: '+31',  flag: 'ðŸ‡³ðŸ‡±', name: 'Netherlands' },
  { code: '+64',  flag: 'ðŸ‡³ðŸ‡¿', name: 'New Zealand' },
  { code: '+505', flag: 'ðŸ‡³ðŸ‡®', name: 'Nicaragua' },
  { code: '+227', flag: 'ðŸ‡³ðŸ‡ª', name: 'Niger' },
  { code: '+234', flag: 'ðŸ‡³ðŸ‡¬', name: 'Nigeria' },
  { code: '+389', flag: 'ðŸ‡²ðŸ‡°', name: 'North Macedonia' },
  { code: '+47',  flag: 'ðŸ‡³ðŸ‡´', name: 'Norway' },
  { code: '+968', flag: 'ðŸ‡´ðŸ‡²', name: 'Oman' },
  { code: '+92',  flag: 'ðŸ‡µðŸ‡°', name: 'Pakistan' },
  { code: '+507', flag: 'ðŸ‡µðŸ‡¦', name: 'Panama' },
  { code: '+675', flag: 'ðŸ‡µðŸ‡¬', name: 'Papua New Guinea' },
  { code: '+595', flag: 'ðŸ‡µðŸ‡¾', name: 'Paraguay' },
  { code: '+51',  flag: 'ðŸ‡µðŸ‡ª', name: 'Peru' },
  { code: '+63',  flag: 'ðŸ‡µðŸ‡­', name: 'Philippines' },
  { code: '+48',  flag: 'ðŸ‡µðŸ‡±', name: 'Poland' },
  { code: '+351', flag: 'ðŸ‡µðŸ‡¹', name: 'Portugal' },
  { code: '+974', flag: 'ðŸ‡¶ðŸ‡¦', name: 'Qatar' },
  { code: '+40',  flag: 'ðŸ‡·ðŸ‡´', name: 'Romania' },
  { code: '+7',   flag: 'ðŸ‡·ðŸ‡º', name: 'Russia' },
  { code: '+250', flag: 'ðŸ‡·ðŸ‡¼', name: 'Rwanda' },
  { code: '+966', flag: 'ðŸ‡¸ðŸ‡¦', name: 'Saudi Arabia' },
  { code: '+221', flag: 'ðŸ‡¸ðŸ‡³', name: 'Senegal' },
  { code: '+381', flag: 'ðŸ‡·ðŸ‡¸', name: 'Serbia' },
  { code: '+232', flag: 'ðŸ‡¸ðŸ‡±', name: 'Sierra Leone' },
  { code: '+65',  flag: 'ðŸ‡¸ðŸ‡¬', name: 'Singapore' },
  { code: '+421', flag: 'ðŸ‡¸ðŸ‡°', name: 'Slovakia' },
  { code: '+386', flag: 'ðŸ‡¸ðŸ‡®', name: 'Slovenia' },
  { code: '+252', flag: 'ðŸ‡¸ðŸ‡´', name: 'Somalia' },
  { code: '+27',  flag: 'ðŸ‡¿ðŸ‡¦', name: 'South Africa' },
  { code: '+82',  flag: 'ðŸ‡°ðŸ‡·', name: 'South Korea' },
  { code: '+211', flag: 'ðŸ‡¸ðŸ‡¸', name: 'South Sudan' },
  { code: '+34',  flag: 'ðŸ‡ªðŸ‡¸', name: 'Spain' },
  { code: '+94',  flag: 'ðŸ‡±ðŸ‡°', name: 'Sri Lanka' },
  { code: '+249', flag: 'ðŸ‡¸ðŸ‡©', name: 'Sudan' },
  { code: '+597', flag: 'ðŸ‡¸ðŸ‡·', name: 'Suriname' },
  { code: '+46',  flag: 'ðŸ‡¸ðŸ‡ª', name: 'Sweden' },
  { code: '+41',  flag: 'ðŸ‡¨ðŸ‡­', name: 'Switzerland' },
  { code: '+963', flag: 'ðŸ‡¸ðŸ‡¾', name: 'Syria' },
  { code: '+886', flag: 'ðŸ‡¹ðŸ‡¼', name: 'Taiwan' },
  { code: '+992', flag: 'ðŸ‡¹ðŸ‡¯', name: 'Tajikistan' },
  { code: '+255', flag: 'ðŸ‡¹ðŸ‡¿', name: 'Tanzania' },
  { code: '+66',  flag: 'ðŸ‡¹ðŸ‡­', name: 'Thailand' },
  { code: '+228', flag: 'ðŸ‡¹ðŸ‡¬', name: 'Togo' },
  { code: '+216', flag: 'ðŸ‡¹ðŸ‡³', name: 'Tunisia' },
  { code: '+90',  flag: 'ðŸ‡¹ðŸ‡·', name: 'Turkey' },
  { code: '+993', flag: 'ðŸ‡¹ðŸ‡²', name: 'Turkmenistan' },
  { code: '+256', flag: 'ðŸ‡ºðŸ‡¬', name: 'Uganda' },
  { code: '+380', flag: 'ðŸ‡ºðŸ‡¦', name: 'Ukraine' },
  { code: '+971', flag: 'ðŸ‡¦ðŸ‡ª', name: 'United Arab Emirates' },
  { code: '+44',  flag: 'ðŸ‡¬ðŸ‡§', name: 'United Kingdom' },
  { code: '+1',   flag: 'ðŸ‡ºðŸ‡¸', name: 'United States' },
  { code: '+598', flag: 'ðŸ‡ºðŸ‡¾', name: 'Uruguay' },
  { code: '+998', flag: 'ðŸ‡ºðŸ‡¿', name: 'Uzbekistan' },
  { code: '+58',  flag: 'ðŸ‡»ðŸ‡ª', name: 'Venezuela' },
  { code: '+84',  flag: 'ðŸ‡»ðŸ‡³', name: 'Vietnam' },
  { code: '+967', flag: 'ðŸ‡¾ðŸ‡ª', name: 'Yemen' },
  { code: '+260', flag: 'ðŸ‡¿ðŸ‡²', name: 'Zambia' },
  { code: '+263', flag: 'ðŸ‡¿ðŸ‡¼', name: 'Zimbabwe' },
];

const HERO_BG = 'https://imperial-ventures-assets.s3.eu-north-1.amazonaws.com/website/hero-contact.png';

const API = API_BASE;

// â”€â”€â”€ Validation schema â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const schema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Please enter a valid email address'),
  organization: yup.string().required('Organisation name is required'),
  executiveRole: yup.string().required('Executive role is required'),
  jurisdiction: yup.string().required('Please select a jurisdiction'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9\s\-()]+$/, 'Please enter a valid phone number'),
  inquiryDetails: yup
    .string()
    .required('Inquiry details are required'),
});

// â”€â”€â”€ Field components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Label({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor} className="block text-midnight font-semibold text-sm mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-red-500 text-xs">{message}</p>;
}

const inputBase =
  'w-full px-4 py-3 rounded-sm border text-midnight text-sm placeholder-gray-400 bg-cream/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold';
const inputNormal = `${inputBase} border-gray-200 hover:border-gray-300`;
const inputError = `${inputBase} border-red-400 focus:ring-red-300 focus:border-red-400`;

// â”€â”€â”€ Contact Info card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gold/15 last:border-b-0">
      <div className="flex-shrink-0 w-9 h-9 rounded-sm bg-gold/15 flex items-center justify-center mt-0.5">
        <Icon size={16} className="text-gold" />
      </div>
      <div>
        <p className="text-midnight/60 text-xs font-semibold uppercase tracking-[0.15em] mb-1">
          {label}
        </p>
        <p className="text-midnight font-medium text-sm leading-relaxed whitespace-pre-line">
          {value}
        </p>
      </div>
    </div>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Contact() {
  // Settings
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/settings`)
      .then((res) => setSettings(res.data.settings ?? res.data))
      .catch(() => {/* use fallbacks */});
  }, []);

  const address = settings?.address ?? '25 Griva Digeni Avenue\nLimassol, Cyprus';
  const phone = settings?.phone ?? '+357 25 000 000';
  const email = settings?.email ?? 'info@solvedfinancial.com';

  // Country code selector
  const [countryCode, setCountryCode] = useState('+357');

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API}/contact`, {
        fullName: data.fullName,
        email: data.email,
        organization: data.organization,
        executiveRole: data.executiveRole,
        jurisdiction: data.jurisdiction,
        phone: `${countryCode} ${data.phone}`,
        inquiryDetails: data.inquiryDetails,
      });
      toast.success('Your inquiry has been submitted. We will be in touch shortly.', {
        duration: 5000,
        style: {
          background: '#001B2F',
          color: '#F5F7FA',
          border: '1px solid rgba(212,182,132,0.3)',
          borderRadius: '4px',
          fontSize: '14px',
        },
        iconTheme: { primary: '#D4B684', secondary: '#001B2F' },
      });
      reset();
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        'Something went wrong. Please try again or contact us directly.';
      toast.error(message, {
        duration: 6000,
        style: {
          background: '#fff',
          color: '#001B2F',
          border: '1px solid #fca5a5',
          borderRadius: '4px',
          fontSize: '14px',
        },
      });
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      {/* Toast notifications */}
      <Toaster position="top-right" containerStyle={{ zIndex: 9999 }} />

      {/* 1 â€” Hero */}
      <PageHero
        title="Contact us"
        subtitle="Get in touch with our team to discuss your financial advisory needs."
        bgImage={HERO_BG}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      {/* 2 â€” Main content */}
      <section className="py-16 lg:py-24 bg-cream" aria-label="Contact form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">

            {/* â”€â”€â”€â”€ LEFT: Form (70%) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <AnimatedSection direction="left" className="flex-1 min-w-0 w-full">
              <div className="bg-white rounded shadow-md border border-gray-100 p-8 sm:p-10">
                {/* Card heading */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-7 h-[3px] rounded-full bg-gold flex-shrink-0" />
                  <h2 className="text-midnight font-bold text-xl sm:text-2xl">
                    Get in touch with us!
                  </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" required>Full Name</Label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder="e.g. Alexandra Papadopoulos"
                        className={errors.fullName ? inputError : inputNormal}
                        {...register('fullName')}
                      />
                      <FieldError message={errors.fullName?.message} />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" required>Email</Label>
                      <input
                        id="email"
                        type="email"
                        placeholder="e.g. a.papadopoulos@company.com"
                        className={errors.email ? inputError : inputNormal}
                        {...register('email')}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>

                    {/* Organisation */}
                    <div>
                      <Label htmlFor="organization" required>Organisation Name</Label>
                      <input
                        id="organization"
                        type="text"
                        placeholder="e.g. Acme Capital Ltd"
                        className={errors.organization ? inputError : inputNormal}
                        {...register('organization')}
                      />
                      <FieldError message={errors.organization?.message} />
                    </div>

                    {/* Executive Role */}
                    <div>
                      <Label htmlFor="executiveRole" required>Executive Role</Label>
                      <input
                        id="executiveRole"
                        type="text"
                        placeholder="e.g. Chief Executive Officer"
                        className={errors.executiveRole ? inputError : inputNormal}
                        {...register('executiveRole')}
                      />
                      <FieldError message={errors.executiveRole?.message} />
                    </div>

                    {/* Jurisdiction */}
                    <div>
                      <Label htmlFor="jurisdiction" required>Jurisdiction</Label>
                      <div className="relative">
                        <select
                          id="jurisdiction"
                          className={`appearance-none pr-10 ${errors.jurisdiction ? inputError : inputNormal}`}
                          {...register('jurisdiction')}
                        >
                          <option value="">Select a jurisdiction...</option>
                          <option value="Cyprus">Cyprus</option>
                          <option value="Netherlands">Netherlands</option>
                          <option value="Greece">Greece</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                      </div>
                      <FieldError message={errors.jurisdiction?.message} />
                    </div>

                    {/* Phone Number with country code selector */}
                    <div>
                      <Label htmlFor="phone" required>Phone Number</Label>
                      <div className={`flex rounded-sm overflow-hidden border ${errors.phone ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'} transition-all duration-200 focus-within:ring-2 focus-within:ring-gold focus-within:border-gold`}>
                        {/* Country code dropdown */}
                        <div className="relative flex-shrink-0 border-r border-gray-200 bg-gray-50" style={{ width: '112px' }}>
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="appearance-none w-full h-full pl-3 pr-7 bg-transparent text-midnight text-sm font-medium focus:outline-none cursor-pointer"
                            aria-label="Country code"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={`${c.name}-${c.code}`} value={c.code}>
                                {c.code} {c.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="25 000 000"
                          className="flex-1 px-3 py-3 bg-cream/50 text-midnight text-sm placeholder-gray-400 focus:outline-none"
                          {...register('phone')}
                        />
                      </div>
                      <FieldError message={errors.phone?.message} />
                    </div>

                    {/* Inquiry details â€” full width */}
                    <div className="sm:col-span-2">
                      <Label htmlFor="inquiryDetails" required>Inquiry Details</Label>
                      <textarea
                        id="inquiryDetails"
                        rows={4}
                        placeholder="Define the scope of strategic consultation required..."
                        className={`resize-none ${errors.inquiryDetails ? inputError : inputNormal}`}
                        {...register('inquiryDetails')}
                      />
                      <FieldError message={errors.inquiryDetails?.message} />
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="mt-7">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-sm
                        bg-gold text-midnight font-bold text-sm tracking-wide uppercase
                        hover:bg-gold-dark active:bg-gold-dark disabled:opacity-60 disabled:cursor-not-allowed
                        transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Inquiry'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </AnimatedSection>

            {/* â”€â”€â”€â”€ RIGHT: Contact Info (30%) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <AnimatedSection
              direction="right"
              delay={0.15}
              className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0"
            >
              <div
                className="rounded border-l-4 border-gold overflow-hidden shadow-sm"
                style={{ background: 'linear-gradient(160deg, #fdf6e8 0%, #f7f0db 100%)' }}
              >
                <div className="p-7 pb-2">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-6 h-[3px] rounded-full bg-gold flex-shrink-0" />
                    <h2 className="text-midnight font-bold text-sm uppercase tracking-[0.18em]">
                      Global Headquarter
                    </h2>
                  </div>
                </div>

                <div className="px-7 pb-7">
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={address}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Phone number"
                    value={phone}
                  />
                  <InfoRow
                    icon={Mail}
                    label="Email"
                    value={email}
                  />
                </div>

                {/* Map placeholder */}
                <div
                  className="h-[200px] w-full relative overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(212,182,132,0.2) 0%, rgba(0,27,47,0.1) 100%)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={28} className="text-gold mx-auto mb-2" />
                      <p className="text-midnight/50 text-xs font-medium">Limassol, Cyprus</p>
                    </div>
                  </div>
                  {/* Grid lines for map feel */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-10"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {[...Array(8)].map((_, i) => (
                      <line
                        key={`h${i}`}
                        x1="0"
                        y1={`${(i + 1) * 12.5}%`}
                        x2="100%"
                        y2={`${(i + 1) * 12.5}%`}
                        stroke="#001B2F"
                        strokeWidth="0.5"
                      />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`v${i}`}
                        x1={`${(i + 1) * 10}%`}
                        y1="0"
                        x2={`${(i + 1) * 10}%`}
                        y2="100%"
                        stroke="#001B2F"
                        strokeWidth="0.5"
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer CTA + Footer */}
      <FooterCTA />
      <Footer />
    </div>
  );
}
