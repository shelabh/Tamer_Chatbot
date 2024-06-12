import clsx from 'clsx'
import Balancer from 'react-wrap-balancer'

// wrap Balancer to remove type errors :( - @TODO - fix this ugly hack
const BalancerWrapper = (props: any) => <Balancer {...props} />

export type Message = {
  who: 'bot' | 'user' | undefined
  message?: string
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
    <div className="flex flex-grow space-x-3">
      <div className="min-w-0 flex-1">
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
            <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
          </div>
          <div className="h-2 rounded bg-zinc-500"></div>
        </div>
      </div>
    </div>
  </div>
)

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ))

export function ChatLine({ who = 'bot', message }: Message) {
  if (!message) {
    return null
  }
  const formatteMessage = convertNewLines(message)

  return (
    <div
      className={
        who != 'bot' ? 'float-right clear-both' : 'float-left clear-both'
      }
    >
      <BalancerWrapper>
        <div className={clsx('text', who == 'bot' ? "float-right rounded-lg mb-3 overflow-auto py-3 px-4 bg-gray-100 text-black   sm:px-6" : "float-right rounded-lg mb-3 overflow-auto py-3 px-4 bg-blue-500 text-black   sm:px-6")}>
          {/* <div className=" flex flex-col items-start break-words"> */}
            <div className="prose text-inherit text-left w-full break-words dark:prose-invert  ">
              {/* <p className="font-large text-xxl text-gray-900">
                <a href="#" className="hover:underline">
                  {who == 'bot' ? 'Bot' : 'You'}
                </a>
              </p> */}
              <p
                className={clsx(
                  'text ',
                  who == 'bot' ? ' text-black ' : 'text-white '
                )}
              >
                {formatteMessage}
              </p>
            </div>
          {/* </div> */}
        </div>
      </BalancerWrapper>
    </div>
  )
}