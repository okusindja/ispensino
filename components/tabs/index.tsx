import * as RadixTabs from '@radix-ui/react-tabs';
import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Typography } from '@/elements/typography';

import { TabsProps } from './tabs.types';

const Tabs: FC<TabsProps> = ({
  px,
  tabContent,
  tabList,
  variant = 'primary',
}) => {
  return (
    <>
      <RadixTabs.Root asChild className="TabsRoot" defaultValue="Tab0">
        <Div gridColumn="1/-1" width="100%">
          <RadixTabs.List
            asChild
            className="TabsList"
            aria-label="Tab Navigation"
          >
            <Div
              mx={px}
              pb="0"
              p={
                variant === 'secondary'
                  ? 'S'
                  : variant === 'tertiary'
                    ? '0'
                    : 'XS'
              }
              mb={variant !== 'tertiary' ? 'XL' : '2XL'}
              borderTopLeftRadius={variant !== 'tertiary' ? 'M' : '0'}
              borderTopRightRadius={variant !== 'tertiary' ? 'M' : '0'}
              borderBottomLeftRadius={variant !== 'secondary' ? '0' : 'M'}
              borderBottomRightRadius={variant !== 'secondary' ? '0' : 'M'}
              background={
                variant === 'tertiary'
                  ? 'surface_dark'
                  : variant === 'secondary'
                    ? 'primary'
                    : 'disabled'
              }
            >
              <Div display="flex">
                {tabList.map((tabTrigger, index) => (
                  <RadixTabs.Trigger
                    asChild
                    key={'Tab' + index}
                    value={'Tab' + index}
                    className={`TabsTrigger${
                      variant !== 'primary' ? `--${variant}` : ''
                    }`}
                  >
                    <Div
                      p={variant !== 'tertiary' ? 'M' : 'L'}
                      cursor="pointer"
                      flex={variant !== 'tertiary' ? '1' : 'unset'}
                      borderTopLeftRadius={variant !== 'tertiary' ? 'M' : '0'}
                      borderTopRightRadius={variant !== 'tertiary' ? 'M' : '0'}
                      borderBottomLeftRadius={
                        variant !== 'secondary' ? '0' : 'M'
                      }
                      borderBottomRightRadius={
                        variant !== 'secondary' ? '0' : 'M'
                      }
                    >
                      <Typography
                        size="small"
                        variant="fancy"
                        overflow="hidden"
                        lineClamp={1}
                        textTransform="capitalize"
                        WebkitLineClamp={1}
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        textAlign="center"
                      >
                        {tabTrigger}
                      </Typography>
                    </Div>
                  </RadixTabs.Trigger>
                ))}
              </Div>
            </Div>
          </RadixTabs.List>
          {tabContent.map((content, index) => (
            <RadixTabs.Content
              key={'Tab' + index}
              className="TabsContent"
              value={'Tab' + index}
            >
              {content}
            </RadixTabs.Content>
          ))}
        </Div>
      </RadixTabs.Root>
    </>
  );
};

export default Tabs;
