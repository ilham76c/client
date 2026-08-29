export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-gray-800 bg-gray-950'>
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
          {/* Brand */}
          <div className='text-center md:text-left'>
            <div className='text-sm font-semibold text-gray-300'>
              EquityLens
            </div>

            <p className='mt-1 text-xs text-gray-500'>
              Data &amp; analytics pasar saham Indonesia.
            </p>
          </div>

          {/* Links */}
          <nav className='flex items-center gap-5 text-sm text-gray-500'>
            <a href='/about' className='transition-colors hover:text-gray-300'>
              Tentang
            </a>

            <a
              href='/disclaimer'
              className='transition-colors hover:text-gray-300'
            >
              Disclaimer
            </a>

            <a
              href='/privacy'
              className='transition-colors hover:text-gray-300'
            >
              Privacy
            </a>
          </nav>
        </div>

        {/* Disclaimer */}
        <div className='mt-6 border-t border-gray-800 pt-5'>
          <p className='text-xs leading-relaxed text-gray-600 text-center'>
            Data dan informasi yang tersedia di EquityLens hanya untuk tujuan
            informasi dan bukan merupakan rekomendasi atau nasihat investasi.
            Selalu lakukan riset dan pertimbangan Anda sendiri sebelum mengambil
            keputusan investasi.
          </p>
        </div>

        {/* Copyright */}
        <div className='mt-4 text-center text-xs text-gray-600'>
          © {year} EquityLens. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
