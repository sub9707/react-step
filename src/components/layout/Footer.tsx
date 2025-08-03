import { SITE_CONFIG } from "../../assets/data/UIData";
import Container from "../common/Container";


const Footer: React.FC = () => {

  return (
    <footer className="bg-gray-50 mt-auto dark:bg-dark-3">
      <Container>
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              © 2025 {SITE_CONFIG.name}. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a 
                href={SITE_CONFIG.contact.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white"
              >
                GitHub
              </a>
              <a 
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white"
              >
                {SITE_CONFIG.contact.email}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer