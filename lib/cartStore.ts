export type CartItem = {
  slug: string;
  categoria: string;
  nome: string;
  precoUnitario: number;
  quantidade: number;
};

const STORAGE_KEY = "america-nativa:carrinho";

function lerDoStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const salvo = window.localStorage.getItem(STORAGE_KEY);
    return salvo ? (JSON.parse(salvo) as CartItem[]) : [];
  } catch {
    return [];
  }
}

let itensStore: CartItem[] = lerDoStorage();
const listeners = new Set<() => void>();

function emitir() {
  listeners.forEach((listener) => listener());
}

function persistir() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(itensStore));
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): CartItem[] {
  return itensStore;
}

// Snapshot estável usado durante a renderização no servidor (e na primeira
// hidratação no cliente) para evitar mismatch — o valor real do localStorage
// é aplicado logo em seguida via useSyncExternalStore.
export function getServerSnapshot(): CartItem[] {
  return [];
}

export function adicionarItem(item: Omit<CartItem, "quantidade">, quantidade = 1) {
  const existente = itensStore.find((i) => i.slug === item.slug);
  itensStore = existente
    ? itensStore.map((i) =>
        i.slug === item.slug ? { ...i, quantidade: i.quantidade + quantidade } : i
      )
    : [...itensStore, { ...item, quantidade }];
  persistir();
  emitir();
}

export function removerItem(slug: string) {
  itensStore = itensStore.filter((i) => i.slug !== slug);
  persistir();
  emitir();
}

export function atualizarQuantidade(slug: string, quantidade: number) {
  if (quantidade < 1) return;
  itensStore = itensStore.map((i) => (i.slug === slug ? { ...i, quantidade } : i));
  persistir();
  emitir();
}

export function limparCarrinho() {
  itensStore = [];
  persistir();
  emitir();
}
