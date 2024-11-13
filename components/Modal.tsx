import * as Dialog from '@radix-ui/react-dialog'
import { IoMdClose } from 'react-icons/io'

interface ModalProps {
    isOpen: boolean
    onChange: (open: boolean) => void
    title: string
    description: string
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onChange,
    title,
    description,
    children,
}) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-neutral-900/90 backdrop-blur-sm fixed inset-0" />

                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Content className="drop-shadow-md border border-neutral-700 max-h-full h-full md:h-auto md:max-h-[85vh] w-full md:w-[90vw] md:max-w-[450px] rounded-md bg-neutral-800 p-[25px] focus:outline-none">
                        <Dialog.Title className="text-xl text-center font-bold mb-4">
                            {title}
                        </Dialog.Title>

                        <Dialog.Description className="mb-5 text-sm leading-normal text-center">
                            {description}
                        </Dialog.Description>

                        <div>{children}</div>

                        <Dialog.Close asChild>
                            <button className="text-neutral-400 hover:text-white absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] items-center justify-center rounded-full focus:outline-none">
                                <IoMdClose size={20} />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default Modal
