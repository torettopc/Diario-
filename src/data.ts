/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Photo, Milestone, FuturePlan } from "./types";

export const DEFAULT_PHOTOS: Photo[] = [
  {
    id: "photo_1",
    title: "Nossa primeira foto juntos ❤️",
    caption: "No carro, vestindo o manto do Flamengo, dividindo sorrisos e a nossa paixão.",
    defaultImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    placementHint: "Foto de vocês no carro, sorrindo felizes vestindo a camisa do Flamengo."
  },
  {
    id: "photo_2",
    title: "Cumplicidade Sem Palavras 🖤🤍",
    caption: "O preto e branco que ressalta a nossa sintonia em cada singelo olhar de carinho.",
    defaultImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
    placementHint: "Foto em preto e branco dela sorrindo meiga encostada no seu peito."
  },
  {
    id: "photo_3",
    title: "Amor que vai além do beijo ❤️",
    caption: "Um instante paralisado no tempo, de pura paixão e entrega de nós dois.",
    defaultImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=600",
    placementHint: "Mirror selfie apaixonada de vocês dois se beijando no chuveiro."
  },
  {
    id: "photo_4",
    title: "No Show do Fabinho 🎵",
    caption: "A nossa trilha sonora tocando ao vivo e o coração batendo no mesmo compasso.",
    defaultImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600",
    placementHint: "Foto ou vídeo de vocês cantando e se beijando no meio do show."
  },
  {
    id: "photo_5",
    title: "Chamego No Elevador 🛗",
    caption: "Aqueles flagras espelhados e fofos que nos fazem sorrir o dia inteiro.",
    defaultImage: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=600",
    placementHint: "Mirror selfie dele beijando sua bochecha espontaneamente no elevador."
  },
  {
    id: "photo_6",
    title: "Nossa Sintonia de Verão ☀️",
    caption: "Sol, calor, cumplicidade e a certeza de que somos o porto seguro um do outro.",
    defaultImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    placementHint: "Mirror selfie do casal de trajes de banho vermelhos em um momento descontraído."
  },
  {
    id: "photo_7",
    title: "Noite de Brindes 🍷",
    caption: "Cada risada solta e cada comemoração ao lado de quem faz a minha vida colorida.",
    defaultImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
    placementHint: "Selfie de vocês à noite em um bar ou show brindando com copos na mão."
  },
  {
    id: "photo_8",
    title: "Chamego de Domingo 🛏️",
    caption: "Preguiça boa e um aconchego quentinho que eu nunca mais quero soltar.",
    defaultImage: "https://images.unsplash.com/photo-1505489425671-80a11942068e?auto=format&fit=crop&q=80&w=600",
    placementHint: "Selfie deitada na cama dando um beijo carinhoso na bochecha dele."
  },
  {
    id: "photo_9",
    title: "Iluminados Pelo Sol 🌻",
    caption: "O dia brilha mais forte quando você sorri de volta para mim.",
    defaultImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
    placementHint: "Foto ensolarada de vocês bem colados ao ar livre com sorrisos radiantes."
  },
  {
    id: "photo_10",
    title: "Momentos Que Marcam 🥂",
    caption: "Não importa onde, o que importa é estarmos sintonizados no mesmo carinho.",
    defaultImage: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=600",
    placementHint: "Selfie em um restaurante ou mesa celebrando mais um momento leve."
  }
];

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: "m_1",
    date: "14/11/2025",
    title: "O Primeiro Encontro",
    description: "O dia em que nossos caminhos se cruzaram pela primeira vez. Aquele nervosismo gostoso e a certeza de que seria o início de algo inexplicavelmente especial.",
    iconType: "smile"
  },
  {
    id: "m_2",
    date: "25/11/2025",
    title: "O Nosso Primeiro Beijo",
    description: "O beijo que selou a enorme sintonia que já sentíamos. Foi quando o tempo parou e percebemos que o nosso cantinho era um nos braços do outro.",
    iconType: "heart"
  },
  {
    id: "m_3",
    date: "25/12/2025",
    title: "Pedido oficial de Namoro!",
    description: "A data de início do namoro: 25 de Dezembro de 2025. O dia de Natal que nos deu o maior presente de todos: o compromisso de nos amarmos, cuidarmos e sonharmos juntos.",
    iconType: "star"
  },
  {
    id: "m_4",
    date: "14/02/2026",
    title: "Nossa Primeira Viagem",
    description: "Pegamos a estrada, colecionamos as primeiras playlist conjuntas, lanchamos coisas bobas e voltamos ainda mais apaixonados.",
    iconType: "map"
  },
  {
    id: "m_5",
    date: "10/06/2026",
    title: "Nosso Portal de Amor!",
    description: "Criamos esse cantinho virtual só nosso, uma cápsula do tempo para guardarmos cada foto, pedaço de história e sorrisos eternos.",
    iconType: "camera"
  }
];

export const DEFAULT_FUTURE_PLANS: FuturePlan[] = [
  {
    id: "plan_1",
    text: "Fazer uma viagem longa para a praia nas férias",
    completed: false,
    category: "viagem"
  },
  {
    id: "plan_2",
    text: "Conhecer um restaurante novo e romântico todo mês",
    completed: true,
    category: "lazer"
  },
  {
    id: "plan_3",
    text: "Adotar ou cuidar de um pet juntos no futuro",
    completed: false,
    category: "casa"
  },
  {
    id: "plan_4",
    text: "Assistir a um belo nascer do sol abraçados",
    completed: false,
    category: "lazer"
  },
  {
    id: "plan_5",
    text: "Montar nosso próprio cantinho decorado com as nossas fotos",
    completed: false,
    category: "casa"
  },
  {
    id: "plan_6",
    text: "Aprender uma receita gourmet juntos na cozinha",
    completed: true,
    category: "lazer"
  }
];

export const DEFAULT_DECLARATION = `Meu amor,

Desde o dia 25/12/2025, a minha vida ganhou cores muito mais vibrantes e o meu coração encontrou um porto seguro de pura cumplicidade. Olhar para cada foto nossa é lembrar da leveza do teu sorriso, do aconchego do teu abraço e do carinho incomparável que dividimos em cada momento juntos.

Você é a pessoa que transforma os dias mais simples em memórias eternas. Amo nossa sintonia, amo como vibramos juntos pelo nosso Flamengo, amo o seu abraço sob a água, o beijo roubado no elevador e todo e qualquer instante no qual nossos olhares se encontram.

Prometo cuidar de você, caminhar ao seu lado nos momentos fáceis e difíceis, e continuar construindo uma história linda e cheia de respeito. Esse aplicativo é apenas um pedacinho físico do infinito que quero viver com você.

Com todo o amor do mundo, para sempre,
Seu amor. ❤️`;
