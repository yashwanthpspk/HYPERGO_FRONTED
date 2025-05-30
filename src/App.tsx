import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useTheme } from "@heroui/use-theme";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import FormBuilder from './components/form-builder';
import FormPreview from './components/form-preview';
import FormResponses from './components/form-responses';
import ThemeSwitcher from './components/theme-switcher';

const App: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="animated-background"></div>
        <Navbar isBordered className="backdrop-blur-md bg-background/70">
          <NavbarBrand>
            <Link href="/" className="font-bold text-inherit flex items-center">
              <Icon icon="lucide:layout-template" className="mr-2 text-primary" width={24} />
              <p className="font-bold text-inherit gradient-header text-xl">FormCraft</p>
            </Link>
          </NavbarBrand>
          <NavbarContent justify="end">
            <NavbarItem>
              <ThemeSwitcher />
            </NavbarItem>
            <NavbarItem>
              <Button 
                as={Link} 
                href="https://github.com/yourusername/form-builder" 
                variant="flat" 
                startContent={<Icon icon="lucide:github" />}
                className="bg-gradient-to-r from-primary-400 to-secondary-400 text-white"
              >
                GitHub
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
        <main className="pattern-bg">
          <Switch>
            <Route exact path="/" component={FormBuilder} />
            <Route path="/preview/:formId" component={FormPreview} />
            <Route path="/responses/:formId" component={FormResponses} />
          </Switch>
        </main>
      </div>
    </div>
  );
};

export default App;