import Feed from "@components/Feed"
import PromptWall from "@components/PromptWall"
import Hero from "@components/Hero"

function page() {
  return (
    <section className="w-full flex flex-col items-center">
      {/* Full-bleed hero (escapes the .app max-width; -mt-24 cancels .app's top padding) */}
      <div className="w-screen -mt-24">
        <Hero
          eyebrow="Curated AI prompts"
          title="Discover & Share AI-Powered Prompts"
          subtitle="Promptopia is an open-source AI prompting tool for the modern world to discover, create and share creative prompts."
          ctaLabel="Explore prompts"
          ctaHref="#prompts"
        />
      </div>

      <div id="prompts" className="w-full flex flex-col items-center scroll-mt-24">
        <PromptWall />
        <Feed />
      </div>
    </section>
  )
}

export default page
