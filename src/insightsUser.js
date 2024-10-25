import Home from "./home"
import Insights from "./insights"
import React from "react"
const InsightsUser = () =>{
    return <div>
        <Home/>
        <Insights
        role={"User"}/>
    </div>
}

export default InsightsUser;