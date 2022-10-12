import Image from 'next/image';
import Link from 'next/link';
import logo from '../public/sapling-logo.png';

const Navbar = () => {
  return (
        <nav id="navbar" className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
            <Link href="/" passHref>
              <a className="navbar-brand flex align-items-center">
                <Image src={logo} alt="Sapling Tree Logo"/>
                <div className="flex-col">
                  <span>Sapling</span>
                </div>
              </a>
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
           
              </ul>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li><a className="btn btn-sapling" href="https://marketplace.visualstudio.com/items?itemName=team-sapling.sapling" target="_blank" rel="noreferrer">Get Sapling</a></li>
              </ul>
            </div>
          </div>
    </nav>
  )
};

export default Navbar;