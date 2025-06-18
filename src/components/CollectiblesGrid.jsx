import CollectibleCard from "./CollectibleCard"

const CollectiblesGrid = ({ collectibles, onPurchase, issuedCards, userId, isLoading, onCollectibleCreated }) => {
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-primary mb-4">Featured Collection</h2>
          <p className="text-gray-600 font-body">Loading collectibles...</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    )
  }

  if (collectibles.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-primary mb-4">Featured Collection</h2>
          <p className="text-gray-600 font-body">No collectibles available yet. Create the first one!</p>
        </div>
        <div className="bg-white/50 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-heading font-semibold text-gray-700 mb-2">No Collectibles Yet</h3>
          <p className="text-gray-600 font-body">Be the first to create a digital collectible!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-primary mb-4">Featured Collection</h2>
        <p className="text-gray-600 font-body">Limited edition digital art pieces available now</p>
        <p className="text-sm text-gray-500 mt-2">Showing {collectibles.length} collectible{collectibles.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collectibles.map((item) => (
          <CollectibleCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            image={item.imageUrl}
            available={item.available}
            editionCap={item.editionCap}
            price={item.price}
            onPurchase={onPurchase}
            isIssued={issuedCards.has(item.id)}
            userId={userId}
            createdAt={item.createdAt}
            createdBy={item.createdBy}
          />
        ))}
      </div>
    </section>
  )
}

export default CollectiblesGrid
