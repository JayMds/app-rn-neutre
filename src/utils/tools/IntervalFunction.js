import React, { useEffect, useRef } from "react";


export async function useInterval(callback, delay) {

  const savedCallback = useRef();

  /**
   * Recupère la dernière version de la fonction
   * à executer à chaque interval (rend le hook
   * réutilisable à plusieurs endroits)
   */
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  /**
   *  Définit l'interval
   */
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}


