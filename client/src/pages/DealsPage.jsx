import { useMemo } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import DealCard from '../components/DealCard';
import CountdownTimer from '../components/CountdownTimer';
import { useProductStore } from '../context/ProductStoreContext';

function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

const withDiscount = (p) => {
  const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 10;
  return { ...p, id: p._id || p.id, discount };
};

function DealSection({ title, icon, deals, endsAt }) {
  if (!deals.length) return null;
  return (
    <section className="sec a3" style={{ paddingTop: 0 }}>
      <div className="sec-head">
        <h3 className="sec-title">{icon} {title}</h3>
        <CountdownTimer endsAt={endsAt} label="Ends in" />
      </div>
      <div className="pgrid">
        {deals.map((d) => (
          <DealCard key={d.id} product={d} />
        ))}
      </div>
    </section>
  );
}

export default function DealsPage() {
  const { products, loading } = useProductStore();

  const { todaysDeals, todaysDealsEndsAt, flashSale, flashSaleEndsAt, limitedOffers, limitedOffersEndsAt } = useMemo(() => {
    const dealEligible = products.filter((p) => p.badge === 'sale' || p.badge === 'hot' || p.oldPrice);
    return {
      todaysDeals: dealEligible.slice(0, 8).map(withDiscount),
      todaysDealsEndsAt: endOfToday(),
      flashSale: dealEligible.slice(2, 8).map(withDiscount),
      flashSaleEndsAt: Date.now() + 1000 * 60 * 60 * 4,
      limitedOffers: (dealEligible.slice(4, 12).length ? dealEligible.slice(4, 12) : dealEligible).map(withDiscount),
      limitedOffersEndsAt: Date.now() + 1000 * 60 * 60 * 24 * 3,
    };
  }, [products]);

  if (loading) return <main className="sec a3"><p>Loading deals…</p></main>;

  return (
    <main>
      <div className="sec a3" style={{ paddingBottom: 0 }}>
        <Breadcrumb items={[{ label: 'Deals' }]} />
        <div className="sec-head">
          <div>
            <h3 className="sec-title">Deals & Offers</h3>
            <div className="sec-sub">Hand-picked discounts, updated regularly</div>
          </div>
        </div>
      </div>

      <DealSection title="Today's Deals" icon="📅" deals={todaysDeals} endsAt={todaysDealsEndsAt} />
      <DealSection title="Flash Sale" icon="⚡" deals={flashSale} endsAt={flashSaleEndsAt} />
      <DealSection title="Limited Offers" icon="🏷️" deals={limitedOffers} endsAt={limitedOffersEndsAt} />
    </main>
  );
}
