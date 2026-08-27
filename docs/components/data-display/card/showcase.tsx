'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import CardBasic from './basic';
import CardBorderLess from './border-less';
import CardSimple from './simple';
import CardFlexibleContent from './flexible-content';
import CardInColumn from './in-column';
import CardLoading from './loading';
import CardGridCard from './grid-card';
import CardInner from './inner';
import CardTabs from './tabs';
import CardMeta from './meta';
import CardStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic card", description: "A basic card containing a title, content and an extra corner content. Supports two sizes: medium and small.", Component: CardBasic },
  { file: "border-less", title: "No border", description: "A borderless card on a gray background.", Component: CardBorderLess, background: 'grey' },
  { file: "simple", title: "Simple card", description: "A simple card only containing a content area.", Component: CardSimple },
  { file: "flexible-content", title: "Customized content", description: "You can use Card.Meta to support more flexible content.", Component: CardFlexibleContent },
  { file: "in-column", title: "Card in column", description: "Cards usually cooperate with grid column layout in overview page.", Component: CardInColumn, background: 'grey' },
  { file: "loading", title: "Loading card", description: "Shows a loading indicator while the contents of the card is being fetched.", Component: CardLoading },
  { file: "grid-card", title: "Grid card", description: "Grid style card content.", Component: CardGridCard },
  { file: "inner", title: "Inner card", description: "It can be placed inside the ordinary card to display the information of the multilevel structure.", Component: CardInner },
  { file: "tabs", title: "With tabs", description: "More content can be hosted.", Component: CardTabs },
  { file: "meta", title: "Support more content configuration", description: "A Card that supports cover, avatar, title and description.", Component: CardMeta },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Card by passing objects/functions through classNames and styles.", Component: CardStyleClass },
];

export function CardShowcase() {
  return <Showcase section="data-display" component="card" demos={demos} sources={sources} />;
}
