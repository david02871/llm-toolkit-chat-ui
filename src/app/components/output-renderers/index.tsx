import React, { useMemo } from "react"
import dynamic from "next/dynamic"

interface OutputRendererProps {
  name: string
  value: any
}

interface DynamicComponentProps {
  value: any
}

const OutputRenderer: React.FC<OutputRendererProps> = ({ name, value }) => {
  const DynamicComponent = useMemo(
    () =>
      dynamic(() => import(`./${name}`), {
        loading: () => <div>Loading...</div>,
        ssr: false,
      }) as React.ComponentType<DynamicComponentProps>,
    [name],
  )

  return <DynamicComponent value={value} />
}

export default React.memo(OutputRenderer)
