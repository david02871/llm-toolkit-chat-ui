import React, { useMemo } from "react"
import dynamic from "next/dynamic"

interface OutputRendererProps {
  name: string
  props: any
}

const OutputRenderer: React.FC<OutputRendererProps> = ({ name, props }) => {
  const DynamicComponent = useMemo(
    () =>
      dynamic(() => import(`./${name}`), {
        loading: () => <div>Loading...</div>,
        ssr: false,
      }),
    [name],
  )

  return <DynamicComponent {...props} />
}

export default React.memo(OutputRenderer)
