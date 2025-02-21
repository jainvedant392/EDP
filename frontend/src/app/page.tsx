import { Flex, Text, Button, Heading } from '@radix-ui/themes'
import Hello from '@/components/hello'

export default function Home() {
  return (
    <Flex direction='column' gap='2'>
      <Heading>EDP Project</Heading>
      <Text>Hello from Radix Themes :)</Text>
      <Hello />
      <Button style={{width: "fit-content"}}>Let&apos;s go</Button>
    </Flex>
  )
}
