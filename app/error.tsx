'use client'

export default function ErrorPage({ error, reset }: { error: Error, reset: () => void }) {
    return (
        <div className="py-20  bg-white text-neutral-800 px-5">
            <div className="max-w-lg mx-auto flex flex-col justify-center items-center text-center gap-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
                <p className="font-normal">{error.message}</p>
                <div>
                    <button
                        className="bg-brand px-6 py-2.5 rounded-full font-bold hover:bg-brand-hover transition-all shadow-md hover:shadow-brand/20 text-white text-sm"
                        onClick={reset}>Refresh</button>
                </div>
            </div>
        </div>
    )
}