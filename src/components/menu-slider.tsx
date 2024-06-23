'use client';
import { type Menu } from '@prisma/client';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '~/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRouter } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { useEffect, useState } from 'react';
import { cx } from 'class-variance-authority';

export const MenuSlider = ({ menus }: { menus: Menu[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const goTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="block">
      <Carousel
        className="w-full overflow-hidden"
        setApi={setApi}
        opts={{
          dragFree: true,
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnFocusIn: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {menus.map((menu, index) => (
            <CarouselItem
              key={`menu_${menu.id}`}
              className={cx('basis-1/2 transition-opacity', {
                'opacity-80': current !== index + 1,
              })}
              onClick={() => goTo(index)}
            >
              <MenuCard menu={menu} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
      <div className="flex justify-center">
        <p>
          {current}/{menus.length}
        </p>
      </div>
    </div>
  );
};

const MenuCard = ({ menu }: { menu: Menu }) => {
  const router = useRouter();
  const goToMenu = () => {
    router.push(`/wizard/${menu.id}`);
  };
  return (
    <Card className="relative w-full select-none bg-red-500">
      <CardHeader>
        <CardTitle className="break-all">{menu.name}</CardTitle>
        <CardDescription>{menu.description}</CardDescription>
        <div
          className="absolute right-4 top-4 bg-blue-400 p-3"
          onClick={goToMenu}
        >
          edit
        </div>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};
