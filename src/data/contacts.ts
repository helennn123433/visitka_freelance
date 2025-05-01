
import { Contact } from '@/interfaces/contacts/Contact'
import emailIcon from '@/assets/img/contacts/email.svg'
import phoneIcon from '@/assets/img/contacts/phone.svg'
import telegramIcon from '@/assets/img/contacts/telega.svg'
import whatsAppIcon from '@/assets/img/contacts/whatsApp.svg'

export const contacts: Contact[] = [
	{
		id: 1,
		icon: telegramIcon,
		title: '@frtarget',
		subtitle: 'Telegram — самый оперативный канал для связи с нами.',
	},
	{
		id: 2,
		icon: phoneIcon,
		title: '+7(965)077-89-87',
		subtitle: 'Если мы не смогли Вам оперативно ответить, то обязательно перезвоним.',
	},
	{
		id: 3,
		icon: whatsAppIcon,
		title: '+7(965)077-89-87',
		subtitle: 'Вы можете написать или позвонить нам в WhatsApp.',
	},
	{
		id: 4,
		icon: emailIcon,
		title: 'alexpysenkov@gmail.com',
		subtitle: 'Мы всегда ждем любые Ваши вопросы на почте.',
	},
]
