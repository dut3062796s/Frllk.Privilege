﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frllk.ViewModels
{
    public class GetsResult<T> : ResultBase
    {
        public int Total { get; set; }
        public List<T> Data { get; set; }
    }
}
