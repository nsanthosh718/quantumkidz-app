import { useState, useEffect } from 'react'
import { KidService } from '../services/KidService'

const kidService = new KidService()

export const useKids = () => {
  const [kids, setKids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadKids = async () => {
    try {
      setLoading(true)
      const kidsData = await kidService.getAllKids()
      setKids(kidsData)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createKid = async (kidData) => {
    try {
      const newKid = await kidService.createKid(kidData)
      setKids(prev => [...prev, newKid])
      return newKid
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteKid = async (kidId) => {
    try {
      await kidService.deleteKid(kidId)
      setKids(prev => prev.filter(k => k.id !== kidId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    loadKids()
  }, [])

  return {
    kids,
    loading,
    error,
    createKid,
    deleteKid,
    refreshKids: loadKids
  }
}