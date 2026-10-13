import { Product } from '../types/restaurant';

export const MENU_PRODUCTS: Product[] = [
  // --- MASSAS FRESCAS ---
  {
    id: 'pasta-carbonara',
    name: 'Spaghetti à Carbonara Tradicional',
    italianName: 'Spaghetti alla Carbonara Tradizionale',
    description: 'Receita autêntica romana com gemas de ovos caipiras frescos, Guanciale curado crocante, queijo Pecorino Romano D.O.P e pimenta-do-reino moída na hora. Sem creme de leite!',
    price: 68.0,
    category: 'massas',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
    tags: ['Mais Pedido', 'Receita Clássica'],
    prepTimeMinutes: 18,
    hasCookingPoint: true,
    cookingPoints: ['Al dente (Recomendado)', 'Bem cozida', 'Tradizionale italiana'],
    hasCheeseOption: true,
    cheeseOptions: ['Pecorino Romano extra (+R$ 4,00)', 'Grana Padano Ralado na hora', 'Sem queijo extra'],
    availableExtras: [
      { id: 'ext-guanciale', name: 'Porção Extra de Guanciale Crocante', price: 12.0 },
      { id: 'ext-burrata', name: 'Burrata Cremosa Inteira (120g)', price: 16.0 },
      { id: 'ext-truffle', name: 'Fios de Azeite Trufado Italiano', price: 8.0 }
    ]
  },
  {
    id: 'pasta-bolognese',
    name: 'Tagliatelle ao Ragù Bolonhês da Nonna',
    italianName: 'Tagliatelle al Ragù Bolognese',
    description: 'Massa fresca aos ovos artesanal com molho ragù tradicional de Bologna, cozido lentamente por 6 horas com carnes nobres, mirepoix, vinho tinto e pomodoro San Marzano.',
    price: 64.0,
    category: 'massas',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=800&q=80',
    tags: ['Especial do Chef', 'Cozimento Lento'],
    prepTimeMinutes: 15,
    hasCookingPoint: true,
    cookingPoints: ['Al dente (Recomendado)', 'Bem cozida'],
    hasCheeseOption: true,
    cheeseOptions: ['Grana Padano Ralado na hora', 'Pecorino Romano (+R$ 4,00)', 'Sem queijo'],
    availableExtras: [
      { id: 'ext-ragu', name: 'Concha Extra de Ragù Bolonhês', price: 10.0 },
      { id: 'ext-parmesan', name: 'Lascões de Parmigiano Reggiano 24 meses', price: 9.0 }
    ]
  },
  {
    id: 'pasta-lasagna',
    name: 'Lasanha Tradicional Gratinada',
    italianName: 'Lasagna Tradizionale al Forno',
    description: 'Camadas generosas de massa artesanal, recheadas com rico ragù bovino, molho bechamel aveludado com noz-moscada e gratinada no forno a lenha com muito queijo.',
    price: 72.0,
    category: 'massas',
    imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
    tags: ['Forno a Lenha', 'Reconfortante'],
    prepTimeMinutes: 20,
    hasCheeseOption: true,
    cheeseOptions: ['Parmesão Gratinado Extra (+R$ 5,00)', 'Padrão da Casa'],
    availableExtras: [
      { id: 'ext-focaccia', name: 'Mini Focaccia de Alecrim para Acompanhar', price: 8.0 }
    ]
  },
  {
    id: 'pasta-ravioli',
    name: 'Ravioli de Ricota & Espinafre na Manteiga e Sálvia',
    italianName: 'Ravioli di Ricotta e Spinaci al Burro e Salvia',
    description: 'Massa fresca recheada com ricota artesanal cremosa e espinafre fresco, salteada na manteiga de fazenda dourada, folhas de sálvia crocante e pinoli tostados.',
    price: 66.0,
    category: 'massas',
    imageUrl: 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegetariano', 'Massa Recheada'],
    isVegetarian: true,
    prepTimeMinutes: 16,
    hasCookingPoint: true,
    cookingPoints: ['Al dente (Recomendado)', 'Suave'],
    hasCheeseOption: true,
    cheeseOptions: ['Grana Padano Ralado', 'Sem queijo'],
    availableExtras: [
      { id: 'ext-burrata', name: 'Burrata Cremosa Adicional', price: 16.0 },
      { id: 'ext-salvia', name: 'Sálvia Crocante Extra', price: 4.0 }
    ]
  },
  {
    id: 'pasta-gnocchi',
    name: 'Gnocchi Artesanal aos Quatro Queijos Nobres',
    italianName: 'Gnocchi di Patate ai Quattro Formaggi',
    description: 'Gnocchi leves de batata que derretem na boca, envoltos em fondue aveludado de Gorgonzola dolce, Fontina, Parmigiano Reggiano e Mozzarella fior di latte.',
    price: 65.0,
    category: 'massas',
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    tags: ['Vegetariano', 'Cremoso'],
    isVegetarian: true,
    prepTimeMinutes: 15,
    hasCheeseOption: true,
    cheeseOptions: ['Gorgonzola Extra (+R$ 6,00)', 'Equilíbrio da Casa'],
    availableExtras: [
      { id: 'ext-nozes', name: 'Nozes Tostadas Picadas', price: 6.0 },
      { id: 'ext-truffle', name: 'Toque de Azeite Trufado', price: 8.0 }
    ]
  },

  // --- PIZZAS NAPOLETANAS (Massa de Longa Fermentação) ---
  {
    id: 'pizza-margherita',
    name: 'Pizza Margherita Verace D.O.P',
    italianName: 'Pizza Margherita Verace Napoletana',
    description: 'Massa com fermentação natural de 48h assada a 450°C. Molho de tomate San Marzano importado, mozzarella fior di latte, azeite extra virgem e manjericão fresco colhido na hora.',
    price: 58.0,
    category: 'pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    tags: ['Patrimônio UNESCO', 'Vegetariano'],
    isVegetarian: true,
    prepTimeMinutes: 14,
    availableExtras: [
      { id: 'ext-bufala', name: 'Upgrade para Mozzarella di Bufala Campana', price: 10.0 },
      { id: 'ext-basil', name: 'Manjericão Fresco Adicional', price: 0.0 },
      { id: 'ext-borda', name: 'Borda Recheada com Ricota & Ervas', price: 9.0 }
    ]
  },
  {
    id: 'pizza-diavola',
    name: 'Pizza Diavola com Salame Picante',
    italianName: 'Pizza Diavola Piccante con Salame',
    description: 'Molho San Marzano, mozzarella fior di latte, fatias generosas de salame artesanal levemente apimentado tipo Spianata Calabrese e azeitonas pretas rústicas.',
    price: 64.0,
    category: 'pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    tags: ['Picante Suave', 'Mais Pedido'],
    prepTimeMinutes: 15,
    availableExtras: [
      { id: 'ext-hot-honey', name: 'Fio de Mel Picante (Hot Honey)', price: 7.0 },
      { id: 'ext-salame-extra', name: 'Salame Picante Extra', price: 9.0 }
    ]
  },
  {
    id: 'pizza-burrata-parma',
    name: 'Pizza Burrata & Prosciutto di Parma',
    italianName: 'Pizza Burrata e Crudo di Parma 24 Mesi',
    description: 'Base branca com fior di latte, fatias finíssimas de autêntico Prosciutto di Parma curado 24 meses, rúcula selvagem fresca, tomates confit e uma burrata inteira no centro.',
    price: 76.0,
    category: 'pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    tags: ['Premium', 'Prosciutto D.O.P'],
    prepTimeMinutes: 16,
    availableExtras: [
      { id: 'ext-truffle', name: 'Azeite Trufado Italiano', price: 8.0 },
      { id: 'ext-parma', name: 'Porção Extra de Presunto Parma', price: 14.0 }
    ]
  },

  // --- ANTIPASTI & ENTRADAS ---
  {
    id: 'anti-burrata',
    name: 'Burrata Pugliese com Focaccia Quente',
    italianName: 'Burrata Pugliese con Focaccia al Rosmarino',
    description: 'Burrata cremosa de búfala servida sobre cama de tomates sweet grape confitados em azeite de oliva e alho, pesto genovês de manjericão e fatias crocantes de focaccia ao alecrim.',
    price: 49.0,
    category: 'antipasti',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    tags: ['Para Compartilhar', 'Vegetariano'],
    isVegetarian: true,
    prepTimeMinutes: 10,
    availableExtras: [
      { id: 'ext-focaccia-extra', name: 'Cesta Extra de Focaccia (4 fatias)', price: 10.0 },
      { id: 'ext-pesto', name: 'Pesto Genovês Adicional', price: 6.0 }
    ]
  },
  {
    id: 'anti-bruschetta',
    name: 'Trio de Bruschettas Tradicionais',
    italianName: 'Tris di Bruschette al Pomodoro e Basilico',
    description: 'Três fatias de pão rústico de fermentação natural tostadas na grelha, esfregadas com dente de alho fresco e cobertas com cubos de tomates maduros, manjericão e azeite extravirgem.',
    price: 36.0,
    category: 'antipasti',
    imageUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
    tags: ['Entrada Leve', 'Vegetariano'],
    isVegetarian: true,
    prepTimeMinutes: 10,
    availableExtras: [
      { id: 'ext-parmesan', name: 'Lascões de Grana Padano por cima', price: 6.0 }
    ]
  },
  {
    id: 'anti-arancini',
    name: 'Arancini Siciliani al Ragù (3 Unidades)',
    italianName: 'Arancini Siciliani Croccanti al Ragù',
    description: 'Bolinhos crocantes típicos da Sicília de risoto aromatizado ao açafrão, empanados artesanalmente, recheados com ragù bolonhês e coração de mozzarella derretida.',
    price: 39.0,
    category: 'antipasti',
    imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
    tags: ['Crocante', 'Típico da Sicília'],
    prepTimeMinutes: 12,
    availableExtras: [
      { id: 'ext-aioli', name: 'Maionese de Alho Confitado e Ervas', price: 5.0 }
    ]
  },

  // --- SOBREMESAS (DOLCI) ---
  {
    id: 'dolce-tiramisu',
    name: 'Tiramisù Clássico da Nonna',
    italianName: 'Tiramisù Tradizionale al Mascarpone',
    description: 'A mais famosa sobremesa italiana: biscoitos savoiardi embebidos em café espresso forte e licor de cacau, intercalados com levíssimo creme de queijo mascarpone e cacau puro 100%.',
    price: 32.0,
    category: 'sobremesas',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    tags: ['Favorito da Casa', 'Artesanal'],
    prepTimeMinutes: 5,
    availableExtras: [
      { id: 'ext-espresso', name: 'Acompanhar com 1 Café Espresso Illy', price: 7.0 }
    ]
  },
  {
    id: 'dolce-cannoli',
    name: 'Cannoli Siciliani Crocantes (2 Unidades)',
    italianName: 'Cannoli Siciliani alla Ricotta Dolce',
    description: 'Tubos de massa crocante frita aromatizada com vinho marsala, recheados na hora com creme aveludado de ricota fresca doce, raspas de laranja cristalizada e gotas de chocolate.',
    price: 28.0,
    category: 'sobremesas',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    tags: ['Recheado na Hora', 'Siciliano'],
    prepTimeMinutes: 5
  },
  {
    id: 'dolce-pannacotta',
    name: 'Panna Cotta com Frutas Vermelhas Silvestres',
    italianName: 'Panna Cotta ai Frutti di Bosco',
    description: 'Sobremesa clássica de nata fresca cozida com fava de baunilha de Madagascar, finalizada com coulis artesanal de morangos, amoras e mirtilos levemente cítricos.',
    price: 29.0,
    category: 'sobremesas',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    tags: ['Refrescante', 'Sem Glúten'],
    isGlutenFree: true,
    prepTimeMinutes: 5
  },

  // --- BEBIDAS (BEVANDE) ---
  {
    id: 'bev-aperol',
    name: 'Aperol Spritz Autêntico',
    italianName: 'Aperol Spritz Veneziano',
    description: 'O clássico aperitivo italiano preparado com Aperol original, espumante Prosecco D.O.C italiano, toque de água com gás, gelo e fatia de laranja fresca.',
    price: 36.0,
    category: 'bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80',
    tags: ['Drink Típico', 'Alcoólico'],
    prepTimeMinutes: 4
  },
  {
    id: 'bev-chianti',
    name: 'Vinho Chianti Classico DOCG (Taça 150ml)',
    italianName: 'Vino Rosso Chianti Classico Toscana',
    description: 'Vinho tinto seco toscano da uva Sangiovese. Aromas elegantes de cerejas maduras e notas de especiarias. Harmonização perfeita com massas e ragù.',
    price: 38.0,
    category: 'bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    tags: ['Vinho Italiano', 'Harmonização'],
    prepTimeMinutes: 3
  },
  {
    id: 'bev-sanpellegrino',
    name: 'San Pellegrino com Gás (Garrafa 500ml)',
    italianName: 'Acqua Minerale Naturale Frizzante S.Pellegrino',
    description: 'Água mineral natural gaseificada importada dos Alpes Italianos de San Pellegrino Terme. Elegância pura na mesa.',
    price: 18.0,
    category: 'bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1559839914-ba2ac5cd0c82?auto=format&fit=crop&w=800&q=80',
    tags: ['Importada', 'Não Alcoólico'],
    prepTimeMinutes: 2
  },
  {
    id: 'bev-limoncello',
    name: 'Shot de Limoncello della Costiera (50ml)',
    italianName: 'Limoncello Artigianale di Sorrento',
    description: 'Licor artesanal digestivo servido estupidamente gelado em taça congelada. Feito com infusão de cascas de limão siciliano.',
    price: 18.0,
    category: 'bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    tags: ['Digestivo Gelado', 'Alcoólico'],
    prepTimeMinutes: 2
  },
  {
    id: 'bev-refrigerante',
    name: 'Refrigerante Lata (350ml)',
    italianName: 'Bibite & Refrigeranti',
    description: 'Coca-Cola Tradicional, Coca-Cola Zero ou Guaraná Antarctica gelados com copo e gelo.',
    price: 9.0,
    category: 'bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    tags: ['Gelado'],
    prepTimeMinutes: 2
  }
];

export const CATEGORIES_CONFIG = [
  { id: 'todos', label: 'Tudo', icon: 'Sparkles', count: MENU_PRODUCTS.length },
  { id: 'massas', label: 'Pastas Frescas', icon: 'UtensilsCrossed', count: MENU_PRODUCTS.filter(p => p.category === 'massas').length },
  { id: 'pizzas', label: 'Pizze Napoletane', icon: 'Pizza', count: MENU_PRODUCTS.filter(p => p.category === 'pizzas').length },
  { id: 'antipasti', label: 'Antipasti & Entradas', icon: 'Soup', count: MENU_PRODUCTS.filter(p => p.category === 'antipasti').length },
  { id: 'sobremesas', label: 'Dolci & Sobremesas', icon: 'Cake', count: MENU_PRODUCTS.filter(p => p.category === 'sobremesas').length },
  { id: 'bebidas', label: 'Bevande & Vinhos', icon: 'Wine', count: MENU_PRODUCTS.filter(p => p.category === 'bebidas').length },
] as const;
