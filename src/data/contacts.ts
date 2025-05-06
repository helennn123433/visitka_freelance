import { Contact } from '@/interfaces/contacts/Contact'
import { Icons } from "@/assets/img/Icons"

export const contacts: Contact[] = [
	{
		id: 1,
		icon: Icons.TelegramBlue,
		title: '@frtarget',
		subtitle: 'Telegram — самый оперативный канал для связи с нами.',
	},
	{
		id: 2,
		icon: Icons.PhoneBlue,
		title: '+7(965)077-89-87',
		subtitle: 'Если мы не смогли Вам оперативно ответить, то обязательно перезвоним.',
	},
	{
		id: 3,
		icon: Icons.WhatsAppBlue,
		title: '+7(965)077-89-87',
		subtitle: 'Вы можете написать или позвонить нам в WhatsApp.',
	},
	{
		id: 4,
		icon: Icons.EmailBlue,
		title: 'alexpysenkov@gmail.com',
		subtitle: 'Мы всегда ждем любые Ваши вопросы на почте.',
	},
]
