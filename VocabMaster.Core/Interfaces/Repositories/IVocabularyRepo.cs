﻿using System.Collections.Generic;
using System.Threading.Tasks;
using VocabMaster.Core.Entities;

namespace VocabMaster.Core.Interfaces.Repositories
{
    /// <summary>
    /// Interface for vocabulary repository operations
    /// </summary>
    public interface IVocabularyRepo
    {
        /// <summary>
        /// Gets a random vocabulary from the repository
        /// </summary>
        /// <returns>Random vocabulary or null if none exist</returns>
        Task<Vocabulary> GetRandom();
        
        /// <summary>
        /// Gets the total count of vocabularies in the repository
        /// </summary>
        /// <returns>Count of vocabularies</returns>
        Task<int> Count();
        
        /// <summary>
        /// Gets a random vocabulary excluding words that have already been learned
        /// </summary>
        /// <param name="learnedWords">List of words that have already been learned</param>
        /// <returns>Random vocabulary excluding learned words, or null if all words have been learned</returns>
        Task<Vocabulary> GetRandomExcludeLearned(List<string> learnedWords);
    }
}