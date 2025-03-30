import { Link } from 'expo-router';
// import { openBrowserAsync } from 'expo-web-browser'; // Remove this import
import { type ComponentProps } from 'react';
import { Platform, Linking } from 'react-native'; // Import Linking

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      // Remove target="_blank" as Linking handles external links
      {...rest}
      href={href}
      onPress={async (event) => {
        // Always prevent default linking behavior when using Linking API
        event.preventDefault();
        // Open the link using the device's default browser or app
        try {
          const supported = await Linking.canOpenURL(href);
          if (supported) {
            await Linking.openURL(href);
          } else {
            console.warn(`Don't know how to open this URL: ${href}`);
            // Optionally show an Alert to the user
            // Alert.alert('Cannot Open Link', `This link cannot be opened: ${href}`);
          }
        } catch (error) {
          console.error('Failed to open link:', error);
          // Optionally show an Alert to the user
          // Alert.alert('Error', 'Failed to open the link.');
        }
      }}
    />
  );
}
