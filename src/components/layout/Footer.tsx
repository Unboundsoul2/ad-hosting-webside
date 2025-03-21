import { Container } from "@/components/ui/container";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary py-12 md:py-16">
      <Container className="px-0 mx-0 max-w-none -translate-x-[108px]">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1 lg:col-span-1 ml-3">
            <img src="/A&D-Studios33.png" alt="A&D Studios Logo" className="h-64 w-auto mb-4" />
            <p className="text-muted-foreground mb-6 max-w-xs">
              Premium digital solutions for businesses and individuals since 2020.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Hosting Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Domain Management
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Website Development
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Assistance
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0 ml-3">
            &copy; {currentYear} <img src="/A&D-Studios33.png" alt="A&D Studios Logo" className="h-32 w-auto inline-block" />. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
