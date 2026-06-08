import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="w-full bg-[#18537A] text-white py-8 px-6 md:px-12 mt-auto">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="font-bold text-lg mb-1 tracking-wide">SIRIS</div>
          <div className="text-blue-200 text-sm">
            © 2026 SIRIS. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
        <div className="flex gap-6 text-sm text-blue-100">
          <Link to="#" className="hover:text-white transition-colors">
            Kebijakan Privasi
          </Link>
          <Link to="#" className="hover:text-white transition-colors">
            Syarat & Ketentuan
          </Link>
          <Link to="#" className="hover:text-white transition-colors">
            Kontak
          </Link>
        </div>
      </div>
    </footer>
  );
}
