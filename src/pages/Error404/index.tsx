import { Link } from 'react-router-dom';

import error404 from '@/assets/images/error404.svg';
import { Button } from '@/components/ui/button';

export const Error404 = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-gradient-to-b from-background to-secondary">
      <img
        className="w-sm md:w-md lg:w-xl"
        src={error404}
        alt="Error 404 image"
      />
      <h2 className="text-2xl font-semibold leading-wide tracking-tight text-foreground md:text-3xl">
        Page was not found
      </h2>
      <p className="text-foreground text-center text-sm md:text-xl">
        You may have mistyped the address or the page may have moved.
      </p>
      <Button size="lg" className="mt-4" asChild>
        <Link to="/" className="text-foreground text-sm md:text-lg">
          Go back
        </Link>
      </Button>
    </div>
  );
};
