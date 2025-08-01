import * as RadixTabs from '@radix-ui/react-tabs';
import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Typography } from '@/elements/typography';

import { TabsProps } from './tabs.types';

const Tabs: FC<TabsProps> = ({
  px,
  tabContent,
  tabList,
  position = 'top',
  variant = 'primary',
}) => {
  return (
    <>
      <RadixTabs.Root asChild className="TabsRoot" defaultValue="Tab0">
        <Div gridColumn="1/-1" width="100%">
          {position === 'bottom' &&
            tabContent.map((content, index) => (
              <RadixTabs.Content
                key={'Tab' + index}
                className="TabsContent"
                value={'Tab' + index}
              >
                {content}
              </RadixTabs.Content>
            ))}
          <RadixTabs.List
            asChild
            className="TabsList"
            aria-label="Tab Navigation"
          >
            <Div
              mx={px}
              pb="0"
              {...(position === 'bottom' && { mt: 'XL' })}
              p={
                variant === 'secondary'
                  ? 'S'
                  : variant === 'tertiary'
                    ? '0'
                    : 'M'
              }
              mb={variant !== 'tertiary' ? 'XL' : '2XL'}
              borderRadius="M"
              background={
                variant === 'tertiary'
                  ? 'surface_dark'
                  : variant === 'secondary'
                    ? 'primary'
                    : 'surface'
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
                      borderRadius="S"
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
          {position === 'top' &&
            tabContent.map((content, index) => (
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
